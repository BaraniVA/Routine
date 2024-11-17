import React from 'react';
import { Music, Headphones } from 'lucide-react';

interface MusicPlayerProps {
  platform: 'spotify' | 'amazon';
  url?: string;
}

export default function MusicPlayer({ platform, url }: MusicPlayerProps) {
  const handleConnect = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <button
      onClick={handleConnect}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity ${
        platform === 'spotify' 
          ? 'bg-[#1DB954] hover:bg-[#1ed760]' 
          : 'bg-gradient-to-r from-[#00A8E1] to-[#0040FF]'
      }`}
    >
      {platform === 'spotify' ? (
        <Headphones className="w-5 h-5" />
      ) : (
        <Music className="w-5 h-5" />
      )}
      <span>Open {platform === 'spotify' ? 'Spotify' : 'Amazon Music'}</span>
    </button>
  );
}