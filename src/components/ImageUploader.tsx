import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageSrc: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
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
    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-md w-full md:w-auto">
      <label
        htmlFor="image-upload"
        className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
      >
        Upload Image
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="mt-3 text-gray-300 text-sm">PNG, JPG, GIF up to 10MB</p>
    </div>
  );
};

export default ImageUploader;
