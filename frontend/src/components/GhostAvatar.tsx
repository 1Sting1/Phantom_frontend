import React from 'react';

export const GHOST_AVATARS = [
  { id: 'ghost-1', src: '/ghost-v2-pink.png', name: 'Magenta Phantom' },
  { id: 'ghost-2', src: '/ghost-v2-blue.png', name: 'Blue Phantom' },
  { id: 'ghost-3', src: '/ghost-v2-green.png', name: 'Green Phantom' },
  { id: 'ghost-4', src: '/ghost-v2-yellow.png', name: 'Amber Phantom' },
  { id: 'ghost-5', src: '/ghost-v2-pink.png', hue: '240deg', name: 'Purple Phantom' },
];

interface GhostAvatarProps {
  id: string;
  size?: number;
  className?: string;
}

export const GhostAvatar: React.FC<GhostAvatarProps> = ({ id, size = 180, className = '' }) => {
  const ghost = GHOST_AVATARS.find(g => g.id === id) || GHOST_AVATARS[0];

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={ghost.src} 
        alt={ghost.name}
        className="w-full h-full object-cover scale-[1.10]" 
        style={ghost.hue ? { filter: `hue-rotate(${ghost.hue})` } : {}}
        draggable={false}
      />
    </div>
  );
};
