import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function GlassPanel({ children, className = '', glowColor = 'cyan' }: GlassPanelProps) {
  const glowStyles = {
    cyan: 'shadow-cyan-500/20 border-cyan-500/30 hover:shadow-cyan-500/40',
    purple: 'shadow-purple-500/20 border-purple-500/30 hover:shadow-purple-500/40',
  };

  return (
    <div
      className={`
        backdrop-blur-md bg-black/40 border rounded-lg
        transition-all duration-300
        ${glowStyles[glowColor as keyof typeof glowStyles]}
        ${className}
      `}
      style={{
        boxShadow: `0 0 20px ${glowColor === 'cyan' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(168, 85, 247, 0.2)'}`,
      }}
    >
      {children}
    </div>
  );
}
