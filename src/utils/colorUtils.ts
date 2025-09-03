/**
 * Retrieves the RGBA color components of a pixel at the given coordinates from ImageData.
 * @param imageData The ImageData object.
 * @param x The x-coordinate of the pixel.
 * @param y The y-coordinate of the pixel.
 * @returns An array [R, G, B, A] representing the pixel's color.
 */
export function getPixelColor(imageData: ImageData, x: number, y: number): [number, number, number, number] {
  const index = (y * imageData.width + x) * 4;
  return [
    imageData.data[index],
    imageData.data[index + 1],
    imageData.data[index + 2],
    imageData.data[index + 3],
  ];
}

/**
 * Sets the RGBA color components of a pixel at the given coordinates in ImageData.
 * @param imageData The ImageData object.
 * @param x The x-coordinate of the pixel.
 * @param y The y-coordinate of the pixel.
 * @param color An array [R, G, B, A] representing the new color.
 */
export function setPixelColor(imageData: ImageData, x: number, y: number, color: [number, number, number, number]) {
  const index = (y * imageData.width + x) * 4;
  imageData.data[index] = color[0];
  imageData.data[index + 1] = color[1];
  imageData.data[index + 2] = color[2];
  imageData.data[index + 3] = color[3];
}

/**
 * Compares two RGBA color arrays with an optional tolerance.
 * @param color1 The first color array [R, G, B, A].
 * @param color2 The second color array [R, G, B, A].
 * @param tolerance The maximum allowed difference for each color component (0 for exact match).
 * @returns True if the colors match within the tolerance, false otherwise.
 */
export function colorsMatch(color1: [number, number, number, number], color2: [number, number, number, number], tolerance: number = 0): boolean {
  if (tolerance === 0) {
    return (
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3]
    );
  }
  // Check if each component is within the tolerance range
  return (
    Math.abs(color1[0] - color2[0]) <= tolerance &&
    Math.abs(color1[1] - color2[1]) <= tolerance &&
    Math.abs(color1[2] - color2[2]) <= tolerance &&
    Math.abs(color1[3] - color2[3]) <= tolerance
  );
}

/**
 * Converts a hexadecimal color string to an RGBA array.
 * Assumes full opacity (255) for the alpha channel.
 * @param hex The hexadecimal color string (e.g., "#RRGGBB" or "#RGB").
 * @returns An array [R, G, B, A].
 */
export function hexToRgba(hex: string): [number, number, number, number] {
  let r = 0, g = 0, b = 0;

  // Handle #RRGGBB or #RGB
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  return [r, g, b, 255]; // Assume full opacity for hex colors
}

/**
 * Converts RGBA color components to a hexadecimal color string.
 * @param r Red component (0-255).
 * @param g Green component (0-255).
 * @param b Blue component (0-255).
 * @returns A hexadecimal color string (e.g., "#RRGGBB").
 */
export function rgbaToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
