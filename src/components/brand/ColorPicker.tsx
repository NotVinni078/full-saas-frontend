
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, description }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-input cursor-pointer"
        />
        <Input
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default ColorPicker;
