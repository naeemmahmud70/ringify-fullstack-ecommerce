import React, { useState } from "react";
import { Controller } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";
interface PhoneInputProps {
  control: any; // react-hook-form control
  name: string;
  defaultCountry?: string;
  error?: string;
  className?: string;
  placeholder?: string;
}
const PhoneInputField: React.FC<PhoneInputProps> = ({
  control,
  name,
  defaultCountry = "in",
  error,
  className,
  placeholder,
}) => {
  const [prevCountryCode, setPrevCountryCode] = useState("91");
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            enableSearch
            // countryCodeEditable={false}
            placeholder={placeholder}
            country={defaultCountry}
            value={field.value}
            onChange={(phone, country) => {
              const countryCode = (country as CountryData)?.dialCode || "";
              if (countryCode !== prevCountryCode) {
                phone = ""; // Reset phone number on country change
              }
              setPrevCountryCode(countryCode); // Update state with new country code
              // Ensure the country code is not removed
              if (!phone.startsWith(`${countryCode}`)) {
                phone = `+${countryCode}`;
              }
              // Reset phone input when the country changes
              const cleanedPhone = phone.replace(`${countryCode}`, "") || "";
              const formattedPhone = `+${countryCode}-${cleanedPhone}`;
              field.onChange(formattedPhone);
            }}
            inputProps={{
              className: className,
            }}
            containerClass="custom-phone-input"
            buttonClass="custom-flag-dropdown"
            dropdownClass="custom-phone-dropdown"
          />
        )}
      />
      {error && (
        <p className="text-[#D80A0A] text-[14px] font-poppins">{error}</p>
      )}
    </>
  );
};
export default PhoneInputField;
