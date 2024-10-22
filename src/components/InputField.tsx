import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  displayValue?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, id, displayValue, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center gap-2">
          {icon}
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            {...props}
            className="pl-3"
          />
          {displayValue && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
              {displayValue}
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';