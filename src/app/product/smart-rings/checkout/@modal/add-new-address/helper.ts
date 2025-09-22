import { z } from "zod";

// Form data interface
export interface FormData {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  country: string;
  state: string;
  city: string;
  contactNumber: string;
  saveAs: string;
}

// Select option interface
export interface SelectOption {
  value: string;
  label: string;
}

// Save as options
export const SAVE_AS_OPTIONS: SelectOption[] = [
  { value: "Home", label: "Home" },
  { value: "Office", label: "Office" },
  { value: "Other", label: "Other" },
];

// Custom select styles
export const SELECT_STYLES = {
  control: (provided: any, state: any) => ({
    ...provided,
    height: "48px",
    padding: "6px 8px",
    margin: "0px",
    borderRadius: "88px",
    backgroundColor: "transparent",
    borderColor: "#D1D1D1",
    boxShadow: state.isFocused ? "#D1D1D1" : "none",
    "&:hover": {
      borderColor: "#D1D1D1",
    },
  }),
};

export const createFormSchema = (isOtherSelected: boolean) =>
  z.object({
    firstName: z
      .string()
      .nonempty({ message: "First name is required" })
      .min(4, { message: "First name must be at least 4 characters" })
      .max(15, { message: "First name should not exceed 15 characters" }),
    lastName: z
      .string()
      .nonempty({ message: "Last name is required" })
      .min(4, { message: "Last name must be at least 4 characters" })
      .max(15, { message: "Last name should not exceed 15 characters" }),
    addressLine1: z.string().min(2, { message: "Please enter address" }),
    addressLine2: z.string().optional(),
    pincode: z
      .string()
      .min(4, { message: "Postal code must be at least 4 digits" })
      .max(10, { message: "Postal code cannot exceed 10 digits" })
      .regex(/^[a-zA-Z0-9\s\-]+$/, {
        message: "Postal code must be alphanumeric or numeric",
      }),
    country: z.string().min(2, { message: "Please select country name" }),
    state: z.string().min(2, { message: "Please select state name" }),
    city: z.string().min(2, { message: "Please select city name" }),
    contactNumber: z
      .string()
      .nonempty({ message: "Phone number is required" })
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(15, { message: "Phone number cannot exceed 15 digits" })
      .regex(/^\+\d{1,4}-\d{6,15}$/, { message: "Enter a valid phone number" }),
    saveAs: isOtherSelected
      ? z
          .string()
          .min(4, { message: "Address type must be at least 4 characters" })
      : z.string().nonempty({ message: "Address type is required" }),
  });
