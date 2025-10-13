import { Check } from "lucide-react";
import { forwardRef, InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", disabled, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <label
        className={`inline-flex items-center gap-3 cursor-pointer select-none min-h-[44px] ${
          disabled ? "cursor-not-allowed" : ""
        } ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          
          {/* Checkbox box */}
          <div
            className={`
              w-5 h-5 rounded
              border-2 
              flex items-center justify-center
              transition-all duration-200
              ${
                disabled
                  ? "border-[#2a2a2a] bg-[#111] cursor-not-allowed"
                  : checked
                  ? "border-white bg-white"
                  : "border-white bg-[#111] peer-hover:border-[#e0e0e0]"
              }
              peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black
            `}
          >
            {checked && (
              <Check
                className={`w-3 h-3 stroke-[3px] ${
                  disabled ? "text-[#6e6e6e]" : "text-black"
                }`}
                strokeWidth={3}
              />
            )}
          </div>
        </div>

        {label && (
          <span
            className={`
              flex-1 transition-all
              ${disabled ? "text-[#6e6e6e]" : "text-white"}
              ${checked && !disabled ? "font-medium" : ""}
            `}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
