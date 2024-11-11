import React, { useEffect, useRef, useState } from 'react';

interface HalftoneVideoProps {
  videoUrl: string;
  dotSize?: number;
  spacing?: number;
  className?: string;
  fallbackColor?: string;
}

export const HalftoneVideo: React.FC<HalftoneVideoProps> = ({
  videoUrl,
  dotSize = 8,
  spacing = 10,
  className = '',
  fallbackColor = '#000000'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();

    const processFrame = () => {
      if (!ctx || !video || video.paused || video.ended) return;

      // Ensure video has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animationRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Only process if canvas has valid dimensions
      if (canvas.width > 0 && canvas.height > 0) {
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Clear canvas
        ctx.fillStyle = fallbackColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw halftone pattern
        for (let y = 0; y < canvas.height; y += spacing) {
          for (let x = 0; x < canvas.width; x += spacing) {
            const pos = (y * canvas.width + x) * 4;
            const brightness = (data[pos] + data[pos + 1] + data[pos + 2]) / 3 / 255;
            
            const radius = (dotSize * brightness) / 2;
            
            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationRef.current = requestAnimationFrame(processFrame);
    };

    const handleVideoError = (e: Event) => {
      console.error('Video loading error:', e);
      setError('Failed to load video');
    };

    const handleVideoLoad = () => {
      setError(null);
      video.play().catch(e => {
        console.error('Video playback error:', e);
        setError('Failed to play video');
      });
    };

    // Event listeners
    video.addEventListener('loadedmetadata', handleVideoLoad);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('play', processFrame);
    window.addEventListener('resize', resizeCanvas);

    // Load video
    video.load();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      video.removeEventListener('loadedmetadata', handleVideoLoad);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('play', processFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [dotSize, spacing, fallbackColor]);

  if (error) {
    return (
      <div className={`fixed inset-0 -z-10 ${className} bg-black flex items-center justify-center text-white/50`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <video
        ref={videoRef}
        className="hidden"
        src={videoUrl}
        muted
        loop
        playsInline
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ backgroundColor: fallbackColor }}
      />
    </div>
  );
};