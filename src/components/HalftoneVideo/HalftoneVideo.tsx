import { useState } from 'react';
import { VideoPlayer } from '../Video/VideoPlayer';
import { HalftoneRenderer } from '../Canvas/HalftoneRenderer';
import { useWindowSize } from '../../hooks/useWindowSize';

interface HalftoneVideoProps {
  videoUrl: string;
  dotSize?: number;
  spacing?: number;
  className?: string;
  fallbackColor?: string;
}

export const HalftoneVideo = ({
  videoUrl,
  dotSize = 8,
  spacing = 10,
  className = '',
  fallbackColor = '#000000'
}: HalftoneVideoProps) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowSize();

  if (error) {
    return (
      <div className={`fixed inset-0 -z-10 ${className} bg-black flex items-center justify-center text-white/50`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <VideoPlayer
        src={videoUrl}
        onLoad={setVideoElement}
        onError={setError}
      />
      {videoElement && (
        <HalftoneRenderer
          width={width}
          height={height}
          videoElement={videoElement}
          dotSize={dotSize}
          spacing={spacing}
          fallbackColor={fallbackColor}
        />
      )}
    </div>
  );
};