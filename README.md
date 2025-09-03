# Image Color Changer

A modern and elegant web application built with React, Vite, and Tailwind CSS that allows users to upload an image, select a color, and change the color of a specific area in the image by clicking on it.

## Features

*   **Image Upload**: Easily upload images in common formats (PNG, JPG).
*   **Interactive Color Change**: Click on any part of the uploaded image to change the color of the contiguous area to your selected color.
*   **Color Picker**: Choose your desired replacement color using a standard color input.
*   **Download Modified Image**: Save your edited image as a PNG file.
*   **Responsive Design**: Clean and modern UI with Tailwind CSS.

## Tech Stack

*   **Frontend**: React 18 (with Hooks)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Language**: TypeScript

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js (LTS version recommended) and npm (or yarn/pnpm) installed.

### 1. Clone the repository

```bash
git clone <repository-url>
cd image-color-changer
```

### 2. Install dependencies

```bash
npm install
# or yarn install
# or pnpm install
```

### 3. Run the development server

```bash
npm run dev
# or yarn dev
# or pnpm dev
```

This will start the Vite development server, usually at `http://localhost:5173`. Open this URL in your browser.

### 4. Build for production

```bash
npm run build
# or yarn build
# or pnpm build
```

This command bundles the application for production into the `dist` directory.

## Usage

1.  **Upload Image**: Click the "Upload Image" button and select an image file from your computer.
2.  **Select Color**: Use the color picker to choose the color you want to use for the replacement.
3.  **Change Color**: Click on the area of the image you wish to recolor. The contiguous pixels of the same color will be replaced with your chosen color.
4.  **Download Image**: Once you are satisfied with your changes, click the "Download Image" button to save the modified image.