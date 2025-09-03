import React, { useRef, useEffect, useCallback, useState } from 'react';
import { getPixelColor, setPixelColor, colorsMatch, hexToRgba } from '../utils/colorUtils';

interface CanvasEditorProps {
  imageSrc: string;
  selectedColor: string;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ imageSrc, selectedColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const drawImageOnCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;

    // Set canvas dimensions to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Store original image data
    try {
      originalImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.error("Could not get image data. Make sure the image is from the same origin or CORS is enabled.", e);
      alert("Error: Could not process image. Please try a different image or ensure it's from a trusted source.");
      originalImageDataRef.current = null;
    }
    setImageLoaded(true);
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Important for CORS if image is from different origin
    img.src = imageSrc;
    img.onload = () => {
      drawImageOnCanvas(img);
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
      alert("Failed to load image. Please check the image source.");
    };
  }, [imageSrc, drawImageOnCanvas]);

  const floodFill = useCallback(
    (startX: number, startY: number, replacementColorRgba: [number, number, number, number]) => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas || !originalImageDataRef.current) return;

      // Create a working copy of the image data
      const imageData = new ImageData(
        new Uint8ClampedArray(originalImageDataRef.current.data),
        originalImageDataRef.current.width,
        originalImageDataRef.current.height
      );

      const width = imageData.width;
      const height = imageData.height;

      const targetColor = getPixelColor(imageData, startX, startY);

      // If target color is already the replacement color, do nothing
      if (colorsMatch(targetColor, replacementColorRgba, 0)) {
        return;
      }

      const stack: [number, number][] = [[startX, startY]];
      const visited = new Uint8Array(width * height); // 0 = not visited, 1 = visited

      const getPixelIndex = (x: number, y: number) => y * width + x;

      while (stack.length > 0) {
        const [x, y] = stack.pop()!;

        // Check bounds
        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        const pixelIndex = getPixelIndex(x, y);
        if (visited[pixelIndex]) continue; // Already visited

        visited[pixelIndex] = 1; // Mark as visited

        const currentColor = getPixelColor(imageData, x, y);

        // Use a small tolerance for color matching to account for image compression artifacts
        // A tolerance of 0 means exact match. Increase for more 'fuzzy' selection.
        const colorTolerance = 5; // Adjust this value as needed

        if (colorsMatch(currentColor, targetColor, colorTolerance)) {
          setPixelColor(imageData, x, y, replacementColorRgba);

          // Add neighbors to stack
          stack.push([x + 1, y]);
          stack.push([x - 1, y]);
          stack.push([x, y + 1]);
          stack.push([x, y - 1]);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    },
    []
  );

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || !imageLoaded) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = Math.floor((event.clientX - rect.left) * scaleX);
      const y = Math.floor((event.clientY - rect.top) * scaleY);

      const replacementColorRgba = hexToRgba(selectedColor);

      floodFill(x, y, replacementColorRgba);
    },
    [selectedColor, floodFill, imageLoaded]
  );

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, []);

  const resetImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx && originalImageDataRef.current) {
      ctx.putImageData(originalImageDataRef.current, 0, 0);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative border-2 border-purple-500 rounded-lg overflow-hidden shadow-xl max-w-full max-h-[70vh] flex justify-center items-center bg-gray-800">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="cursor-crosshair max-w-full max-h-full object-contain"
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
            Loading image...
          </div>
        )}
      </div>
      {imageLoaded && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={downloadImage}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Download Image
          </button>
          <button
            onClick={resetImage}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Reset Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
