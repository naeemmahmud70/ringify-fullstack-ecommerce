import React from "react";
import Image from "next/image";

import { Input, InputProps } from "./input";
import { alphanumericRegex } from "@/utils/regexPatterns";

import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";

interface InputBoxI extends InputProps {
  className: string;
  placeholder: string;
  type?: string;
  form?: any;
  name: string;
  disabled?: boolean;
  // Remove value from here to prevent conflicts
  autoComplete?: string;
  autoFocus?: boolean;
  max?: number;
  maxLength?: number;
  min?: string | number;
  step?: number;
  id?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  displayIcon?: boolean;
  iconName?: string;
  isDiscountCodeUnique?: any;
}

const InputBox = ({
  className,
  placeholder,
  type = "text",
  form,
  name,
  disabled = false,
  autoComplete = "on",
  autoFocus,
  max,
  maxLength,
  min,
  step,
  id,
  onBlur,
  readOnly,
  displayIcon = false,
  iconName = "",
  isDiscountCodeUnique,
}: InputBoxI) => {
  // Function to handle input sanitization when type is number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      // Remove non-numeric characters except for decimal point if needed
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    }
    if (name === "contactNumber") {
      e.target.value = e.target.value.replace(/[^0-9+-]/g, "");
    }
    if (e.target.name.trim() === "discountCode") {
      const discountCode = e.target.value.trim();

      // Real-time validation for alphanumeric characters
      if (!alphanumericRegex.test(discountCode)) {
        form.setError(name, {
          type: "manual",
          message:
            "Discount Code must be alphanumeric characters (letters and numbers only), and contain at least one letter",
        });
      } else if (discountCode.length === 6) {
        isDiscountCodeUnique(discountCode, form.setError, form.clearErrors);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            {displayIcon && iconName ? (
              <label className="flex items-center">
                <Input
                  autoFocus={name === "contactNumber" ? false : autoFocus}
                  min={min}
                  max={max}
                  maxLength={maxLength}
                  step={step}
                  id={id}
                  type={type}
                  className={className}
                  placeholder={placeholder}
                  disabled={disabled}
                  autoComplete={autoComplete}
                  {...field}
                  onBlur={e => {
                    field.onBlur(); // Preserve the form's onBlur behavior
                    if (onBlur) {
                      onBlur(e);
                    }
                  }}
                  readOnly={readOnly}
                  onInput={handleInputChange} // Filter the input on change
                />
                <Image
                  src={iconName}
                  alt=""
                  className="ml-2 w-[12px] sm:w-[12px] h-[12px] sm:h-[12px] cursor-pointer"
                  width={12}
                  height={12}
                  quality={100}
                />
              </label>
            ) : (
              <Input
                autoFocus={name === "contactNumber" ? false : autoFocus}
                min={min}
                max={max}
                maxLength={maxLength}
                step={step}
                id={id}
                type={type}
                className={className}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                {...field}
                onBlur={e => {
                  field.onBlur(); // Preserve the form's onBlur behavior
                  if (onBlur) {
                    onBlur(e);
                  }
                }}
                onWheel={e => {
                  if (type === "number") {
                    e.currentTarget.blur();
                  } // Prevent scrolling behavior
                }}
                readOnly={readOnly}
                onInput={handleInputChange} // Filter the input on change
              />
            )}
          </FormControl>
          <FormMessage className="text-[#D80A0A] text-[14px] font-normal font-poppins leading-4" />
        </FormItem>
      )}
    />
  );
};

export default InputBox;
