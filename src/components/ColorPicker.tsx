import React, { ChangeEvent } from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    onColorChange(event.target.value);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md w-full md:w-auto">
      <label htmlFor="color-picker" className="text-lg font-semibold mb-3 text-gray-200">
        Select Replacement Color
      </label>
      <input
        id="color-picker"
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        className="w-24 h-24 rounded-full border-4 border-purple-500 cursor-pointer shadow-inner transition duration-300 ease-in-out transform hover:scale-105"
        style={{ backgroundColor: selectedColor }}
      />
      <p className="mt-3 text-gray-300 text-sm">{selectedColor.toUpperCase()}</p>
    </div>
  );
};

export default ColorPicker;
