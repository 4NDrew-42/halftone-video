import { useEffect, useRef } from 'react';

interface HalftoneRendererProps {
  width: number;
  height: number;
  videoElement: HTMLVideoElement;
  dotSize: number;
  spacing: number;
  fallbackColor: string;
}

export const HalftoneRenderer = ({
  width,
  height,
  videoElement,
  dotSize,
  spacing,
  fallbackColor
}: HalftoneRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const processFrame = () => {
      if (!ctx || videoElement.paused || videoElement.ended) return;

      // Draw video frame to canvas
      ctx.drawImage(videoElement, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Clear canvas
      ctx.fillStyle = fallbackColor;
      ctx.fillRect(0, 0, width, height);

      // Draw halftone pattern
      for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
          const pos = (y * width + x) * 4;
          const brightness = (data[pos] + data[pos + 1] + data[pos + 2]) / 3 / 255;
          
          const radius = (dotSize * brightness) / 2;
          
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(processFrame);
    };

    if (videoElement.readyState >= 2) {
      processFrame();
    }

    const handlePlay = () => {
      processFrame();
    };

    videoElement.addEventListener('play', handlePlay);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      videoElement.removeEventListener('play', handlePlay);
    };
  }, [width, height, videoElement, dotSize, spacing, fallbackColor]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ backgroundColor: fallbackColor }}
    />
  );
};