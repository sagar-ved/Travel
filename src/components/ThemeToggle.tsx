import { Palette } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'neon-blue' | 'cyber-purple';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-6 right-6 z-40 p-3 rounded-lg
        backdrop-blur-md border transition-all duration-300
        ${
          theme === 'neon-blue'
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'
        }
      `}
      style={{
        boxShadow: `0 0 20px ${theme === 'neon-blue' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(168, 85, 247, 0.2)'}`,
      }}
      title="Toggle Theme"
    >
      <Palette className="w-5 h-5 animate-pulse" />
    </button>
  );
}
