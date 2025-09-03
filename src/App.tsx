import { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ColorPicker from './components/ColorPicker';
import CanvasEditor from './components/CanvasEditor';

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000'); // Default to red

  const handleImageUpload = useCallback((src: string) => {
    setImageSrc(src);
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center p-4">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
        Image Color Changer
      </h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-4xl justify-center items-center">
        <ImageUploader onImageUpload={handleImageUpload} />
        <ColorPicker selectedColor={selectedColor} onColorChange={handleColorChange} />
      </div>

      <div className="w-full max-w-4xl bg-gray-700 rounded-lg shadow-xl p-6 flex justify-center items-center min-h-[400px]">
        {imageSrc ? (
          <CanvasEditor imageSrc={imageSrc} selectedColor={selectedColor} />
        ) : (
          <p className="text-gray-400 text-lg">Upload an image to start editing!</p>
        )}
      </div>
    </div>
  );
}

export default App;
