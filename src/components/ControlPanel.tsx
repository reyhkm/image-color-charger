import React, { ChangeEvent } from 'react';

interface ControlPanelProps {
  onImageUpload: (imageSrc: string) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  tolerance: number;
  onToleranceChange: (tolerance: number) => void;
  mode: 'floodFill' | 'replaceAll';
  onModeChange: (mode: 'floodFill' | 'replaceAll') => void;
  onDownload: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  isImageLoaded: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onImageUpload,
  selectedColor,
  onColorChange,
  tolerance,
  onToleranceChange,
  mode,
  onModeChange,
  onDownload,
  onReset,
  onUndo,
  onRedo,
  isImageLoaded,
  canUndo,
  canRedo,
}) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-1">
        {/* Image Upload */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-300">1. Upload Image</h2>
          <label
            htmlFor="image-upload"
            className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <span>🖼️</span>
            <span>Choose an Image</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {isImageLoaded && (
          <>
            {/* Color Picker */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-300">2. Pick a Color</h2>
              <div className="relative">
                <input
                  id="color-picker"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => onColorChange(e.target.value)}
                />
                <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-gray-600 flex items-center justify-end px-4" style={{ borderColor: selectedColor }}>
                  <span className="font-mono text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{selectedColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Tool Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-300">3. Adjust & Apply</h2>
              
              {/* Mode Selector */}
              <div className="space-y-2">
                <label className="font-medium text-gray-400">Tool Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onModeChange('floodFill')}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition ${mode === 'floodFill' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                  >
                    Fill Area
                  </button>
                  <button
                    onClick={() => onModeChange('replaceAll')}
                    className={`py-2 px-3 rounded-md text-sm font-semibold transition ${mode === 'replaceAll' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                  >
                    Replace All
                  </button>
                </div>
              </div>

              {/* Tolerance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="tolerance-slider" className="font-medium text-gray-400">
                    Color Tolerance
                  </label>
                  <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded-md">{tolerance}</span>
                </div>
                <input
                  id="tolerance-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={tolerance}
                  onChange={(e) => onToleranceChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {isImageLoaded && (
        <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <span>↩️</span>
              <span>Undo</span>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <span>↪️</span>
              <span>Redo</span>
            </button>
          </div>
          <button
            onClick={onDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <span>💾</span>
            <span>Download Image</span>
          </button>
          <button
            onClick={onReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>Reset Changes</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
