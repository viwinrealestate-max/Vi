import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useTheme, THEME_OPTIONS, ThemeId } from '../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, themeMeta } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button in Nav */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900/90 hover:bg-stone-800 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm group"
        title="Change Theme & Color Palette"
        aria-label="Change color theme"
      >
        <div className="flex items-center -space-x-1">
          <span 
            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
            style={{ backgroundColor: themeMeta.primaryColor }}
          />
          <span 
            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
            style={{ backgroundColor: themeMeta.accentColor }}
          />
        </div>
        <span className="hidden lg:inline text-stone-200 group-hover:text-white">
          Palette: <span style={{ color: themeMeta.accentColor }}>{themeMeta.name.split(' ')[0]}</span>
        </span>
        <Palette className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
      </button>

      {/* Palette Selection Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-800 px-1">
            <span className="text-xs font-serif font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Choose Luxury Color Palette
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded-md"
              aria-label="Close palette selector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {THEME_OPTIONS.map((option) => {
              const isSelected = currentTheme === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                    isSelected
                      ? 'bg-stone-950 border-amber-500/50 shadow-md'
                      : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/70 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Swatches pill */}
                    <div className="flex items-center -space-x-1.5 p-1 rounded-lg bg-stone-900 border border-stone-800">
                      <span
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: option.primaryColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: option.accentColor }}
                      />
                      <span
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: option.surfaceColor }}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1">
                        {option.name}
                        {option.id === 'nilgiris-emerald' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                            Signature
                          </span>
                        )}
                        {option.id === 'heritage-ivory' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                            Light
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                        {option.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-stone-950 shrink-0 ml-2"
                      style={{ backgroundColor: option.accentColor }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
