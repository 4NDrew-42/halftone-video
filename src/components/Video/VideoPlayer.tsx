import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  onLoad: (video: HTMLVideoElement) => void;
  onError: (error: string) => void;
}

export const VideoPlayer = ({ src, onLoad, onError }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setIsLoading(false);
      video.play().catch((e) => {
        console.error('Video playback error:', e);
        onError('Failed to play video');
      });
      onLoad(video);
    };

    const handleError = () => {
      setIsLoading(false);
      onError('Failed to load video');
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);

    // Start loading
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
    };
  }, [src, onLoad, onError]);

  return (
    <video
      ref={videoRef}
      className="hidden"
      src={src}
      muted
      loop
      playsInline
      crossOrigin="anonymous"
    />
  );
};