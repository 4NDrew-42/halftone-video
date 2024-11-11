import React from 'react';
import { HalftoneVideo } from './components/HalftoneVideo/HalftoneVideo';
import { Github } from 'lucide-react';

function App() {
  return (
    <div className="relative min-h-screen">
      <HalftoneVideo
        videoUrl="https://vimeo.com/1028278412"
        dotSize={6}
        spacing={8}
        fallbackColor="#111827"
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-6xl font-bold mb-6">Halftone Effect</h1>
        <p className="text-xl mb-8 max-w-2xl text-center"></p>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 
                     transition-colors duration-300 rounded-full px-6 py-3"
        >
          <Github className="w-5 h-5" />
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
}

export default App;
