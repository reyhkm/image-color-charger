import React, { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from 'react';
import { getPixelColor, setPixelColor, colorsMatch, hexToRgba } from '../utils/colorUtils';

interface CanvasEditorProps {
  imageSrc: string;
  selectedColor: string;
  tolerance: number;
  mode: 'floodFill' | 'replaceAll';
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export interface CanvasEditorHandle {
  downloadImage: () => void;
  resetImage: () => void;
  undo: () => void;
  redo: () => void;
}

const CanvasEditor = forwardRef<CanvasEditorHandle, CanvasEditorProps>(
  ({ imageSrc, selectedColor, tolerance, mode, onHistoryChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const originalImageDataRef = useRef<ImageData | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    // Notify parent component about history changes
    useEffect(() => {
      if (onHistoryChange) {
        const canUndo = historyIndex > 0;
        const canRedo = historyIndex < history.length - 1;
        onHistoryChange(canUndo, canRedo);
      }
    }, [history, historyIndex, onHistoryChange]);

    const drawImageOnCanvas = useCallback((img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctxRef.current = ctx;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      try {
        const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        originalImageDataRef.current = initialImageData;
        setHistory([initialImageData]);
        setHistoryIndex(0);
        setImageLoaded(true);
        setError(null);
      } catch (e) {
        console.error("CORS error getting image data:", e);
        setError("Cannot process this image due to security restrictions (CORS). Try downloading the image and uploading it from your device.");
        originalImageDataRef.current = null;
        setHistory([]);
        setHistoryIndex(-1);
        setImageLoaded(false);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      setIsLoading(true);
      setImageLoaded(false);
      setError(null);
      setHistory([]);
      setHistoryIndex(-1);
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageSrc;
      img.onload = () => drawImageOnCanvas(img);
      img.onerror = () => {
        setError("Failed to load image. The file might be corrupt or the URL invalid.");
        setIsLoading(false);
      };
    }, [imageSrc, drawImageOnCanvas]);

    const floodFill = useCallback((startX: number, startY: number, replacementColor: [number, number, number, number]) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas || !originalImageDataRef.current) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { width, height } = imageData;
      const targetColor = getPixelColor(imageData, startX, startY);

      if (colorsMatch(targetColor, replacementColor, 0)) return;

      const stack: [number, number][] = [[startX, startY]];
      const visited = new Uint8Array(width * height);

      while (stack.length > 0) {
        const [x, y] = stack.pop()!;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        const index = (y * width + x);
        if (visited[index]) continue;

        const currentColor = getPixelColor(imageData, x, y);
        if (colorsMatch(currentColor, targetColor, tolerance)) {
          setPixelColor(imageData, x, y, replacementColor);
          visited[index] = 1;
          stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }, [tolerance]);

    const replaceAllColors = useCallback((targetColor: [number, number, number, number], replacementColor: [number, number, number, number]) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas || !originalImageDataRef.current) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { width, height } = imageData;

      if (colorsMatch(targetColor, replacementColor, 0)) return;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const currentColor = getPixelColor(imageData, x, y);
          if (colorsMatch(currentColor, targetColor, tolerance)) {
            setPixelColor(imageData, x, y, replacementColor);
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }, [tolerance]);

    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx || !imageLoaded) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor((event.clientX - rect.left) * scaleX);
      const y = Math.floor((event.clientY - rect.top) * scaleY);

      const targetColor = getPixelColor(ctx.getImageData(x, y, 1, 1), 0, 0);
      const replacementColorRgba = hexToRgba(selectedColor);

      if (colorsMatch(targetColor, replacementColorRgba, 0)) return;

      if (mode === 'floodFill') {
        floodFill(x, y, replacementColorRgba);
      } else {
        replaceAllColors(targetColor, replacementColorRgba);
      }

      // After modification, update history
      const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newImageData);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }, [selectedColor, floodFill, replaceAllColors, imageLoaded, mode, history, historyIndex]);

    const downloadImage = useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'colorshift-ai-edited.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }, []);

    const resetImage = useCallback(() => {
      const ctx = ctxRef.current;
      if (ctx && originalImageDataRef.current) {
        ctx.putImageData(originalImageDataRef.current, 0, 0);
        setHistory([originalImageDataRef.current]);
        setHistoryIndex(0);
      }
    }, []);

    const undo = useCallback(() => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        ctxRef.current?.putImageData(history[newIndex], 0, 0);
      }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        ctxRef.current?.putImageData(history[newIndex], 0, 0);
      }
    }, [history, historyIndex]);

    useImperativeHandle(ref, () => ({
      downloadImage,
      resetImage,
      undo,
      redo,
    }));

    return (
      <div className="relative w-full h-full flex justify-center items-center">
        {isLoading && <div className="text-gray-400">Loading image...</div>}
        {error && <div className="text-red-400 max-w-md text-center">{error}</div>}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="cursor-crosshair max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
    );
  }
);

export default CanvasEditor;
