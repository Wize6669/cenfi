import React, { useState, useRef, useEffect } from 'react';
import { CaseSensitive } from "lucide-react";
import { EditorProps } from '@/interfaces/Questions'

const ColorPicker = ({ editor }: EditorProps) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [color, setColor] = useState({ h: 0, s: 0, l: 0, a: 100 });
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorAreaRef = useRef<HTMLDivElement>(null);

  const predefinedColors = [
    '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505',
    '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000',
    '#4A4A4A', '#9B9B9B', '#FFFFFF'
  ];

  const handleColorChange = (newColor: { h: number, s: number, l: number, a: number }) => {
    setColor(newColor);
    const rgbColor = hslToRgb(newColor.h, newColor.s, newColor.l);
    const hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
    editor?.chain().focus().setColor(hexColor).run();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
      setIsColorPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join('');
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleColorAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (colorAreaRef.current) {
      const rect = colorAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const s = Math.round((x / rect.width) * 100);
      const l = Math.round(100 - (y / rect.height) * 100);
      handleColorChange({ ...color, s, l });
    }
  };

  const handleColorAreaDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      handleColorAreaClick(e);
    }
  };

  const currentRgb = hslToRgb(color.h, color.s, color.l);
  const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);

  return (
    <div className="relative inline-block" ref={colorPickerRef}>
      <div className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
        <button
          className={`p-1 rounded-md ${
            isColorPickerOpen ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          title="Color del texto"
          type={'button'}
        >
          <CaseSensitive className={`w-4 h-4 md:w-5 md:h-5 ${isColorPickerOpen ? 'text-blue-500' : 'text-gray-600 dark:text-blue-400'}`} />
        </button>
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-md"
          style={{ backgroundColor: currentHex }}
        ></div>
      </div>

      {isColorPickerOpen && (
        <div
          className={`absolute z-10 md:left-0 right-0 mt-2 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-52 sm:w-56 md:w-64 lg:w-72
          transition-all duration-300 ease-in-out transform origin-top-right ${isColorPickerOpen ? 'animate-slideIn' : 'animate-slideOut'}`}
        >
          <div
            className="mb-3 sm:mb-4 relative h-28 sm:h-32 md:h-36 lg:h-40 rounded-lg overflow-hidden cursor-crosshair"
            ref={colorAreaRef}
            onClick={handleColorAreaClick}
            onMouseMove={handleColorAreaDrag}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, #fff, hsl(${color.h}, 100%, 50%))`,
              }}
            ></div>
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, #000, transparent)',
              }}
            ></div>
            <div
              className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${color.s}%`,
                top: `${100 - color.l}%`,
              }}
            ></div>
          </div>

          <input
            type="range"
            min="0"
            max="360"
            value={color.h}
            onChange={(e) => handleColorChange({...color, h: parseInt(e.target.value)})}
            className="w-full h-3 sm:h-3.5 md:h-4 mb-3 sm:mb-4 appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 rounded-full"
          />

          <div className="flex space-x-1 sm:space-x-2 mb-3 sm:mb-4">
            <div className="flex-1 flex flex-col items-center">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">R</label>
              <input
                type="number"
                value={currentRgb.r}
                onChange={(e) => {
                  const r = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                  const {g, b} = currentRgb;
                  const {h, s, l} = rgbToHsl(r, g, b);
                  handleColorChange({h, s, l, a: color.a});
                }}
                className="w-full px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">G</label>
              <input
                type="number"
                value={currentRgb.g}
                onChange={(e) => {
                  const g = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                  const {r, b} = currentRgb;
                  const {h, s, l} = rgbToHsl(r, g, b);
                  handleColorChange({h, s, l, a: color.a});
                }}
                className="w-full px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">B</label>
              <input
                type="number"
                value={currentRgb.b}
                onChange={(e) => {
                  const b = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                  const {r, g} = currentRgb;
                  const {h, s, l} = rgbToHsl(r, g, b);
                  handleColorChange({h, s, l, a: color.a});
                }}
                className="w-full px-1 sm:px-2 py-1 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md border border-gray-300 dark:border-gray-600"
                 style={{backgroundColor: currentHex}}></div>
            <input
              type="text"
              value={currentHex}
              onChange={(e) => {
                const hex = e.target.value.replace('#', '');
                if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                  const rgb = hexToRgb('#' + hex);
                  if (rgb) {
                    const {h, s, l} = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    handleColorChange({h, s, l, a: color.a});
                  }
                }
              }}
              className="flex-1 px-2 py-1 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center uppercase"
            />
          </div>

          <div className="grid grid-cols-5 gap-1 sm:gap-1.5 md:gap-2">
            {predefinedColors.map((presetColor) => (
              <button
                key={presetColor}
                type={'button'}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-150 hover:scale-110"
                style={{backgroundColor: presetColor}}
                onClick={() => {
                  const rgb = hexToRgb(presetColor);
                  if (rgb) {
                    const {h, s, l} = rgbToHsl(rgb.r, rgb.g, rgb.b);
                    handleColorChange({h, s, l, a: color.a});
                  }
                }}
              ></button>
            ))}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateX(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ColorPicker;
