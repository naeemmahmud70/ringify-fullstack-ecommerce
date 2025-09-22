"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { City, Country, State } from "country-state-city";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModals } from "@/store/modals";
import { zodResolver } from "@hookform/resolvers/zod";

import PhoneInputField from "@/components/ui/PhoneInputField";
import { Form } from "@/components/ui/form";
import InputBox from "@/components/ui/InputBox";
import { Label } from "@/components/ui/label";
import { useLoggedInUser } from "@/store/users";
import {
  createFormSchema,
  FormData,
  SAVE_AS_OPTIONS,
  SELECT_STYLES,
  SelectOption,
} from "./helper";
import { addNewAddress } from "@/services/addresses";
import { useToastStore } from "@/store/toast";

const AddAddress: React.FC = () => {
  const router = useRouter();
  const { setAddAddress, addAddressForm } = useModals();
  const { loggedInUser } = useLoggedInUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const { SetToastStates } = useToastStore();

  // Form setup
  const form = useForm<FormData>({
    resolver: zodResolver(createFormSchema(isOtherSelected)),
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
      saveAs: "",
    },
  });

  // Update form schema when isOtherSelected changes
  useEffect(() => {
    form.clearErrors("saveAs");
  }, [isOtherSelected, form]);

  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    handleSubmit,
    clearErrors,
  } = form;

  // Initialize countries on component mount
  useEffect(() => {
    const validCountries = Country.getAllCountries()
      .filter(country => State.getStatesOfCountry(country.isoCode).length > 0)
      .map(country => ({ value: country.isoCode, label: country.name }));

    setCountries(validCountries);
  }, []);

  // Country selection handler
  const handleCountryChange = (selectedCountry: SelectOption | null) => {
    if (!selectedCountry) {
      setValue("country", "");
      setValue("state", "");
      setValue("city", "");
      setStates([]);
      setCities([]);
      return;
    }

    setValue("country", selectedCountry.label, { shouldValidate: true });
    setValue("state", "");
    setValue("city", "");
    trigger("state");

    const validStates = State.getStatesOfCountry(selectedCountry.value)
      .filter(
        state =>
          City.getCitiesOfState(selectedCountry.value, state.isoCode).length > 0
      )
      .map(state => ({ value: state.isoCode, label: state.name }));

    setStates(validStates);
    setCities([]);
  };

  // State selection handler
  const handleStateChange = (selectedState: SelectOption | null) => {
    if (!selectedState) {
      setValue("state", "");
      setValue("city", "");
      setCities([]);
      return;
    }

    setValue("state", selectedState.label);
    setValue("city", "");
    trigger(["city", "state"]);

    const selectedCountry = countries.find(
      country => country.label === getValues("country")
    );

    if (!selectedCountry) {
      return;
    }

    const citiesData = City.getCitiesOfState(
      selectedCountry.value,
      selectedState.value
    ).map(city => ({
      value: city.name,
      label: city.name,
    }));

    setCities(citiesData);
  };

  // City selection handler
  const handleCityChange = (selectedCity: SelectOption | null) => {
    if (!selectedCity) {
      setValue("city", "");
      return;
    }
    setValue("city", selectedCity.label);
    trigger("city");
  };

  // Save as selection handler
  const handleSaveAsChange = (selected: SelectOption | null) => {
    const selectedValue = selected?.value ?? "";

    if (selectedValue === "Other") {
      setIsOtherSelected(true);
      setValue("saveAs", "");
      clearErrors("saveAs");
    } else {
      setIsOtherSelected(false);
      setValue("saveAs", selectedValue);
      clearErrors("saveAs");
    }
  };

  // Get current save as value for display
  const getCurrentSaveAsValue = () => {
    const currentValue = getValues("saveAs");
    if (isOtherSelected) {
      return { value: "Other", label: "Other" };
    }
    return (
      SAVE_AS_OPTIONS.find(option => option.value === currentValue) || null
    );
  };

  // Form submission handler
  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);

    const payload = {
      email: loggedInUser?.email,
      firstName: values.firstName,
      lastName: values.lastName,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || "",
      city: values.city,
      state: values.state,
      pincode: values.pincode.toString().trim(),
      isSelectedAddress: true,
      contactNumber: values.contactNumber,
      country: values.country,
      saveAs: values.saveAs,
    };

    try {
      const result = await addNewAddress(payload);
      if (result.status == 201) {
        form.reset();
        setIsOtherSelected(false);
        setAddAddress(false);
        router.back();
        SetToastStates({
          message: result.message,
          variant: "success",
          triggerId: Date.now(),
        });
      } else {
        SetToastStates({
          message: result.message || "Failed to add address!",
          variant: "error",
          triggerId: Date.now(),
        });
      }
    } catch (error: any) {
      SetToastStates({
        message: error.message || "Failed to add address!",
        variant: "error",
        triggerId: Date.now(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dialog close handler
  const handleClose = () => {
    setAddAddress(false);
    router.back();
  };

  return (
    <Dialog open={true} onOpenChange={setAddAddress}>
      <DialogContent className="bg-[#F9F9F9] w-full md:w-[632px] max-h-[92vh] overflow-y-auto md:rounded-[20px]outline-0 border-[0px]">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Dialog Header */}
            <DialogHeader>
              <DialogTitle className="text-[24px] text-[#2E2E2E] font-poppins font-semibold leading-[32px]">
                Add New Address
              </DialogTitle>
              <X
                onClick={handleClose}
                className="bg-transparent hover:bg-transparent text-[#2E2E2E] absolute right-5 top-5 h-5 w-5 cursor-pointer"
              />
            </DialogHeader>

            {/* Name Fields */}
            <div className="md:flex justify-between items-start gap-5 pt-2">
              <div className="w-full py-2">
                <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                  First Name
                </Label>
                <InputBox
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  className="w-full text-[#5D5D5D] text-xs font-poppins py-2 h-[48px] px-5 rounded-[88px] border-[#D1D1D1] mt-1"
                  form={form}
                />
                <div className="min-h-[2px]" />
              </div>

              <div className="w-full py-2">
                <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                  Last Name
                </Label>
                <InputBox
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                  className="w-full text-[#5D5D5D] text-xs font-poppins py-2 h-[48px] px-5 rounded-[88px] border-[#D1D1D1] mt-1"
                  form={form}
                />
                <div className="min-h-[2px]" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="grid gap-4 py-2 mt-1">
              <div className="relative">
                <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                  Phone no.
                </Label>
                <PhoneInputField
                  control={control}
                  name="contactNumber"
                  defaultCountry="in"
                  error={errors.contactNumber?.message}
                  placeholder="Enter Contact Number"
                  className="w-full text-[#5D5D5D] text-xs font-poppins py-3 pr-5 pl-12 rounded-[88px] border-[1px] border-[#D1D1D1] mt-1 bg-transparent outline-[0px] outline-[#D1D1D1] h-[48px]"
                />
              </div>
            </div>

            {/* Country Selection */}
            <div className="grid gap-1 py-2 mt-2">
              <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                Country/Region
              </Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    options={countries}
                    placeholder="Select Country"
                    className="font-poppins text-xs text-[#5D5D5D] font-normal leading-[22px] rounded-[88px] mt-1"
                    value={countries.find(c => c.label === field.value) || null}
                    onChange={option => {
                      field.onChange(option?.label ?? "");
                      handleCountryChange(option);
                    }}
                    styles={SELECT_STYLES}
                    components={{ IndicatorSeparator: () => null }}
                  />
                )}
              />
              {errors.country && (
                <p className="text-[#D80A0A] text-[14px] font-poppins">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* Address Fields */}
            <div className="grid gap-4 py-2 mt-2">
              <div className="relative">
                <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                  Address
                </Label>
                <InputBox
                  type="text"
                  name="addressLine1"
                  placeholder="Enter Address"
                  className="w-full text-[#5D5D5D] text-xs font-poppins py-2 h-[48px] px-5 rounded-[88px] border-[#D1D1D1] mt-1"
                  form={form}
                />
              </div>
            </div>

            <div className="grid gap-4 py-2 mt-2">
              <div className="relative">
                <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                  Apartment, suite, etc. (optional)
                </Label>
                <InputBox
                  type="text"
                  name="addressLine2"
                  placeholder="Enter Apartment"
                  className="w-full text-[#5D5D5D] text-xs font-poppins py-2 h-[48px] px-5 rounded-[88px] border-[#D1D1D1] mt-1"
                  form={form}
                />
              </div>
            </div>

            {/* State Selection */}
            <div className="grid gap-1 py-2 mt-2">
              <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                State
              </Label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select
                    options={states}
                    className="font-poppins font-normal text-xs text-[#5D5D5D] leading-[22px]"
                    placeholder="Select State"
                    value={states.find(s => s.label === field.value) || null}
                    onChange={handleStateChange}
                    styles={SELECT_STYLES}
                    isDisabled={!states.length}
                    components={{ IndicatorSeparator: () => null }}
                  />
                )}
              />
              {errors.state && (
                <p className="text-[#D80A0A] text-[14px] font-poppins">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* City and Postal Code */}
            <div className="md:flex items-start gap-5 py-2">
              <div className="w-full py-2">
                <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                  City
                </Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={cities}
                      placeholder="Select City"
                      value={cities.find(c => c.label === field.value) || null}
                      className="w-full font-poppins font-normal text-xs text-[#5D5D5D] leading-[22px] mt-1"
                      onChange={handleCityChange}
                      styles={SELECT_STYLES}
                      isDisabled={!cities.length}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  )}
                />
                <p className="text-[#D80A0A] text-[14px] font-poppins min-h-[2px] mt-1">
                  {errors.city?.message ?? ""}
                </p>
              </div>

              <div className="w-full mt-3 md:mt-0 py-2">
                <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                  Postal code
                </Label>
                <InputBox
                  type="text"
                  name="pincode"
                  placeholder="Pin/Zip Code"
                  className="w-full text-xs text-[#5D5D5D] font-poppins h-[48px] py-3 px-5 rounded-[88px] border-[#D1D1D1] mt-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  form={form}
                />
                <div className="min-h-[2px] mt-1" />
              </div>
            </div>

            {/* Save As Selection */}
            <div className="mt-0">
              <Label className="text-xs font-medium text-gray-700">
                Save As
              </Label>
              <Controller
                name="saveAs"
                control={control}
                render={() => (
                  <Select
                    options={SAVE_AS_OPTIONS}
                    value={getCurrentSaveAsValue()}
                    onChange={handleSaveAsChange}
                    placeholder="Select Address Type"
                    className="w-full font-poppins font-normal text-xs text-[#5D5D5D] leading-[22px] mt-1"
                    styles={SELECT_STYLES}
                    components={{ IndicatorSeparator: () => null }}
                  />
                )}
              />

              {!isOtherSelected && errors.saveAs && (
                <p className="text-[#D80A0A] text-[14px] font-poppins mt-1">
                  {errors.saveAs.message}
                </p>
              )}

              {/* Other Input Field */}
              {isOtherSelected && (
                <div className="grid gap-2 py-2 mt-2">
                  <div className="relative">
                    <Label className="text-xs text-[#2E2E2E] font-poppins font-normal leading-[19px]">
                      Other
                    </Label>
                    <InputBox
                      type="text"
                      name="saveAs"
                      placeholder="Enter other address"
                      className="w-full text-[#5D5D5D] text-xs font-poppins py-2 h-[48px] px-5 rounded-[88px] border-[#D1D1D1] mt-1"
                      form={form}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-5">
              <Button
                disabled={isSubmitting}
                type="submit"
                id="add-new-address"
                className={`w-full h-[56px] bg-green-custom hover:bg-green-custom text-xs font-poppins py-5 rounded-[88px] font-medium ${
                  isSubmitting ? "opacity-50" : "opacity-100"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Address"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddress;
