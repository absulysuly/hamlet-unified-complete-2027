import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface LanguageOption {
  code: string;
  label: string;
  icon?: React.ReactNode;
}

export interface LanguageSwitcherProps {
  currentLanguage: string;
  onChange: (code: string) => void;
  options?: LanguageOption[];
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  buttonLabelRenderer?: (option: LanguageOption) => React.ReactNode;
}

const DEFAULT_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', icon: <span className="text-xl">🇬🇧</span> },
  { code: 'ar', label: 'العربية', icon: <span className="text-xl">🇮🇶</span> },
  { code: 'ku', label: 'کوردی', icon: <span className="text-xl">☀️</span> },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onChange,
  options,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  buttonLabelRenderer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languageOptions = useMemo(() => (options && options.length > 0 ? options : DEFAULT_OPTIONS), [options]);
  const activeOption = languageOptions.find(option => option.code === currentLanguage) ?? languageOptions[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    if (code === currentLanguage) {
      setIsOpen(false);
      return;
    }

    onChange(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(previous => !previous)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md transition-colors hover:bg-white/20"
      >
        {buttonLabelRenderer ? (
          buttonLabelRenderer(activeOption)
        ) : (
          <>
            {activeOption?.icon ?? null}
            <span className="text-sm font-medium">{activeOption?.label ?? currentLanguage.toUpperCase()}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 7.5L10 12L14.5 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-xl border border-white/15 bg-white/10 backdrop-blur-lg shadow-lg p-2 space-y-1 ${dropdownClassName}`}
        >
          {languageOptions.map(option => {
            const isActive = option.code === currentLanguage;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleSelect(option.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive ? 'bg-primary/60 text-white' : 'hover:bg-white/20'
                } ${optionClassName}`}
              >
                {option.icon ?? null}
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
