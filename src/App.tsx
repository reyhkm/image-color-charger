import { useState, useCallback, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import CanvasEditor, { CanvasEditorHandle } from './components/CanvasEditor';

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#5E2DD8'); // A nice purple
  const [tolerance, setTolerance] = useState<number>(20);
  const [mode, setMode] = useState<'floodFill' | 'replaceAll'>('floodFill');

  const canvasEditorRef = useRef<CanvasEditorHandle>(null);

  const handleImageUpload = useCallback((src: string) => {
    setImageSrc(src);
  }, []);

  const handleDownload = useCallback(() => {
    canvasEditorRef.current?.downloadImage();
  }, []);

  const handleReset = useCallback(() => {
    canvasEditorRef.current?.resetImage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-80 bg-gray-800 p-6 flex flex-col gap-8 shadow-2xl z-10">
        <header>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            ColorShift AI
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your smart image color editor.</p>
        </header>

        <ControlPanel
          onImageUpload={handleImageUpload}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          tolerance={tolerance}
          onToleranceChange={setTolerance}
          mode={mode}
          onModeChange={setMode}
          onDownload={handleDownload}
          onReset={handleReset}
          isImageLoaded={!!imageSrc}
        />
      </aside>

      <main className="flex-1 flex justify-center items-center p-4 md:p-8 bg-gray-900">
        <div className="w-full h-full flex justify-center items-center bg-dots-pattern">
          {imageSrc ? (
            <CanvasEditor
              ref={canvasEditorRef}
              imageSrc={imageSrc}
              selectedColor={selectedColor}
              tolerance={tolerance}
              mode={mode}
            />
          ) : (
            <div className="text-center text-gray-500">
              <h2 className="text-2xl font-medium">Upload an image to begin</h2>
              <p>Use the panel on the left to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
