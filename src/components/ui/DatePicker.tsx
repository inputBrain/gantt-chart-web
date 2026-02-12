'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { DayPicker } from 'react-day-picker';

// Helper to format date as YYYY-MM-DD without timezone issues
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse YYYY-MM-DD string to Date without timezone shift
function parseDateString(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

// Format for display
function formatDisplayDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  minDate?: string;
  placeholder?: string;
  required?: boolean;
}

export function DatePicker({ value, onChange, minDate, placeholder = 'Select date', required }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDate = parseDateString(value);
  const minDateParsed = parseDateString(minDate || '');

  // Calculate dropdown position when opening
  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 320; // approximate height
      const spaceBelow = window.innerHeight - rect.bottom;

      // If not enough space below, position above
      const top = spaceBelow < dropdownHeight
        ? rect.top - dropdownHeight - 8
        : rect.bottom + 8;

      setDropdownPosition({
        top,
        left: rect.left,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(formatDateString(date));
      setIsOpen(false);
    }
  };

  const displayValue = selectedDate ? formatDisplayDate(selectedDate) : '';

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-xl border border-border-primary bg-bg-primary px-4 py-3 text-left text-sm
          ${displayValue ? 'text-text-primary' : 'text-text-quaternary'}
          hover:border-border-secondary focus:border-accent focus:outline-none`}
      >
        <div className="flex items-center justify-between">
          <span>{displayValue || placeholder}</span>
          <svg className="h-4 w-4 text-text-quaternary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {required && <input type="hidden" value={value} required />}

      {isOpen && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] rounded-xl border border-border-primary bg-bg-tertiary p-3 shadow-xl"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={minDateParsed ? { before: minDateParsed } : undefined}
            defaultMonth={selectedDate}
            classNames={{
              root: 'text-sm',
              months: 'flex flex-col',
              month: 'space-y-3',
              month_caption: 'flex justify-center relative items-center h-8',
              caption_label: 'text-sm font-semibold text-text-primary',
              nav: 'flex items-center justify-between absolute inset-x-0',
              button_previous: 'p-1 rounded-lg hover:bg-bg-hover text-text-secondary',
              button_next: 'p-1 rounded-lg hover:bg-bg-hover text-text-secondary',
              month_grid: 'w-full border-collapse',
              weekdays: 'flex',
              weekday: 'w-9 h-9 flex items-center justify-center text-xs font-medium text-text-quaternary',
              week: 'flex',
              day: 'w-9 h-9 p-0',
              day_button: 'w-9 h-9 flex items-center justify-center rounded-lg text-sm text-text-secondary hover:bg-bg-hover focus:outline-none',
              selected: '',
              today: '',
              outside: '',
              disabled: '',
            }}
            components={{
              Chevron: ({ orientation }) => (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {orientation === 'left' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  )}
                </svg>
              ),
              DayButton: ({ day, modifiers, ...props }) => (
                <button
                  {...props}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm focus:outline-none
                    ${modifiers.selected ? 'bg-accent text-accent-text' : 'text-text-secondary hover:bg-bg-hover'}
                    ${modifiers.today && !modifiers.selected ? 'font-bold text-accent' : ''}
                    ${modifiers.outside ? 'text-text-quaternary' : ''}
                    ${modifiers.disabled ? 'text-text-quaternary hover:bg-transparent cursor-not-allowed' : ''}`}
                />
              ),
            }}
          />
        </div>
      )}
    </div>
  );
}
