import { forwardRef, InputHTMLAttributes } from "react";

export interface FilterOptionProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

export const FilterOption = forwardRef<HTMLInputElement, FilterOptionProps>(
  ({ label, selected = false, disabled, onSelectedChange, className = "", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelectedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <label
        className={`inline-flex items-center gap-2 cursor-pointer select-none min-h-[44px] transition-opacity duration-150 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            checked={selected}
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          
          {/* Square Box - NO checkmark, just filled when selected */}
          <div
            className={`
              w-5 h-5 rounded
              border-2 
              transition-all duration-150
              ${
                disabled
                  ? "border-[#6e6e6e] bg-transparent"
                  : selected
                  ? "border-white bg-white"
                  : "border-white bg-transparent peer-hover:border-[#e0e0e0]"
              }
              peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black
            `}
          />
        </div>

        <span
          className={`
            flex-1 transition-all duration-150
            ${disabled ? "text-[#6e6e6e]" : "text-white"}
            ${selected && !disabled ? "font-semibold" : ""}
          `}
        >
          {label}
        </span>
      </label>
    );
  }
);

FilterOption.displayName = "FilterOption";
