"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { City, Country, State } from "country-state-city";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import InputBox from "@/components/ui/InputBox";
import { Label } from "@/components/ui/label";
import PhoneInputField from "@/components/ui/PhoneInputField";
import { updateAddress } from "@/services/updatingAddress";
import { useModals } from "@/store/modals";
import { useToastStore } from "@/store/toast";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editformSchema,
  INPUT_CLASS,
  LABEL_CLASS,
  SAVE_AS_OPTIONS,
  SELECT_STYLES,
} from "./helper";

type FormType = z.infer<ReturnType<typeof editformSchema>>;

const EditAddress = () => {
  const { setEditAdressForm, editFormValue } = useModals();

  // State management
  const [countries, setCountries] = useState<
    { value: string; label: string }[]
  >([]);
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const router = useRouter();
  const { SetToastStates } = useToastStore();

  const schema = useMemo(
    () => editformSchema(isOtherSelected),
    [isOtherSelected]
  );

  // Form setup
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
      contactNumber: "",
      saveAs: "",
    },
  });

  // Initialize countries on mount
  useEffect(() => {
    const validCountries = Country.getAllCountries()
      .filter(c => State.getStatesOfCountry(c.isoCode).length > 0)
      .map(c => ({ value: c.isoCode, label: c.name }));
    setCountries(validCountries);
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editFormValue) {
      form.reset({
        firstName: editFormValue.firstName || "",
        lastName: editFormValue.lastName || "",
        addressLine1: editFormValue.addressLine1 || "",
        addressLine2: editFormValue.addressLine2 || "",
        state: editFormValue.state || "",
        country: editFormValue.country || "",
        city: editFormValue.city || "",
        pincode: editFormValue.pincode || "",
        contactNumber: editFormValue.contactNumber || "",
        saveAs: editFormValue.saveAs || "",
      });

      setIsOtherSelected(!["Home", "Office"].includes(editFormValue.saveAs));
    }
  }, [editFormValue, form]);

  // Handle location cascade (country -> state -> city)
  useEffect(() => {
    if (editFormValue?.country) {
      const selectedCountry = Country.getAllCountries().find(
        c => c.name === editFormValue.country
      );
      if (selectedCountry) {
        const statesData = State.getStatesOfCountry(
          selectedCountry.isoCode
        ).map(s => ({ value: s.isoCode, label: s.name }));
        setStates(statesData);

        const selectedState = statesData.find(
          s => s.label === editFormValue.state
        );
        if (selectedState) {
          const citiesData = City.getCitiesOfState(
            selectedCountry.isoCode,
            selectedState.value
          ).map(c => ({ value: c.name, label: c.name }));
          setCities(citiesData);
        }
      }
    }
  }, [editFormValue?.country, editFormValue?.state]);

  // Handlers
  const handleCountryChange = (
    selectedCountry: { value: string; label: string } | null
  ) => {
    if (!selectedCountry) {
      form.setValue("country", "");
      form.setValue("state", "");
      form.setValue("city", "");
      setStates([]);
      setCities([]);
      return;
    }

    form.setValue("country", selectedCountry.label);
    form.setValue("state", "");
    form.setValue("city", "");
    setCities([]);

    const validStates = State.getStatesOfCountry(selectedCountry.value)
      .filter(
        s => City.getCitiesOfState(selectedCountry.value, s.isoCode).length > 0
      )
      .map(s => ({ value: s.isoCode, label: s.name }));
    setStates(validStates);
  };

  const handleStateChange = (
    selectedState: { value: string; label: string } | null
  ) => {
    if (!selectedState) {
      form.setValue("state", "");
      form.setValue("city", "");
      setCities([]);
      return;
    }

    form.setValue("state", selectedState.label);
    form.setValue("city", "");

    const selectedCountry = countries.find(
      c => c.label === form.getValues("country")
    );
    if (selectedCountry) {
      const citiesData = City.getCitiesOfState(
        selectedCountry.value,
        selectedState.value
      ).map(c => ({ value: c.name, label: c.name }));
      setCities(citiesData);
    }
  };

  const handleSaveAsChange = (selected: any) => {
    const value = selected?.value;
    const isOther = value === "Other";
    setIsOtherSelected(isOther);

    form.setValue(
      "saveAs",
      isOther
        ? editFormValue?.saveAs &&
          !["Home", "Office"].includes(editFormValue.saveAs)
          ? editFormValue.saveAs
          : ""
        : (value ?? "")
    );
  };

  const onSubmit = async (values: FormType) => {
    const payload = {
      ...values,
      pincode: values.pincode.toString().trim(),
      isSelectedAddress: true,
    };

    try {
      setDisableBtn(true);
      const res = await updateAddress(editFormValue?.id, payload);
      if (res.status == 200) {
        setEditAdressForm(false);
        setEditAdressForm(false);
        router.back();
        SetToastStates({
          message: res.message,
          variant: "success",
          triggerId: Date.now(),
        });
      } else {
        SetToastStates({
          message: res.message,
          variant: "error",
          triggerId: Date.now(),
        });
      }
    } catch (error: any) {
      SetToastStates({
        message: error.message,
        variant: "error",
        triggerId: Date.now(),
      });
    } finally {
      setDisableBtn(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={setEditAdressForm}>
      <DialogContent className="bg-[#F9F9F9] w-full md:w-[632px] border-0 max-h-[92vh] overflow-y-auto md:rounded-[20px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-[24px] text-[#2E2E2E] font-poppins font-semibold leading-[32px]">
                Edit Address
              </DialogTitle>
              <X
                onClick={() => {
                  setEditAdressForm(false);
                  router.back();
                }}
                className="absolute right-5 top-5 h-5 w-5 cursor-pointer text-[#2E2E2E]"
              />
            </DialogHeader>

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

            <div className="grid gap-4 py-2 mt-2">
              <Label className={LABEL_CLASS}>Phone no.</Label>
              <PhoneInputField
                control={form.control}
                name="contactNumber"
                defaultCountry="bd"
                error={form.formState.errors.contactNumber?.message}
                placeholder="Enter Contact Number"
                className={`${INPUT_CLASS.replace("px-5", "pr-5 pl-12")} border-[1px] bg-transparent outline-[0px] outline-[#D1D1D1]`}
              />
            </div>

            <div className="grid gap-1 py-2 mt-2">
              <Label className={LABEL_CLASS}>Country/Region</Label>
              <Controller
                name="country"
                control={form.control}
                render={() => (
                  <Select
                    options={countries}
                    placeholder="Select Country"
                    value={
                      countries.find(
                        c => c.label === form.getValues("country")
                      ) || null
                    }
                    onChange={handleCountryChange}
                    styles={SELECT_STYLES}
                    components={{ IndicatorSeparator: () => null }}
                  />
                )}
              />
            </div>

            <div className="grid gap-4 py-2 mt-2">
              <Label className={LABEL_CLASS}>Address</Label>
              <InputBox
                type="text"
                name="addressLine1"
                placeholder="Enter Address"
                className={INPUT_CLASS}
                form={form}
              />
            </div>

            <div className="grid gap-4 py-2 mt-2">
              <Label className={LABEL_CLASS}>
                Apartment, suite, etc. (optional)
              </Label>
              <InputBox
                type="text"
                name="addressLine2"
                placeholder="Enter Apartment"
                className={INPUT_CLASS}
                form={form}
              />
            </div>

            <div className="grid gap-1 py-2 mt-2">
              <Label className={LABEL_CLASS}>State</Label>
              <Controller
                name="state"
                control={form.control}
                render={({ field }) => (
                  <Select
                    options={states}
                    placeholder="Select State"
                    value={states.find(s => s.label === field.value) || null}
                    onChange={handleStateChange}
                    styles={SELECT_STYLES}
                    isDisabled={!states.length}
                    components={{ IndicatorSeparator: () => null }}
                  />
                )}
              />
              {form.formState.errors.state && (
                <p className="text-[#D80A0A] text-[14px] font-poppins">
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>

            <div className="md:flex items-start gap-5 py-2">
              <div className="w-full py-2">
                <Label className={LABEL_CLASS}>City</Label>
                <Controller
                  name="city"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      options={cities}
                      placeholder="Select City"
                      value={cities.find(c => c.label === field.value) || null}
                      onChange={selected =>
                        field.onChange(selected?.label || "")
                      }
                      styles={SELECT_STYLES}
                      isDisabled={!cities.length}
                      components={{ IndicatorSeparator: () => null }}
                    />
                  )}
                />
                {form.formState.errors.city && (
                  <p className="text-[#D80A0A] text-[14px] font-poppins min-h-[2px] mt-1">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="w-full mt-3 md:mt-0 py-2">
                <Label className={LABEL_CLASS}>Postal code</Label>
                <InputBox
                  type="text"
                  name="pincode"
                  placeholder="Pin/Zip Code"
                  className={INPUT_CLASS}
                  form={form}
                />
                <div className="min-h-[2px] mt-1" />
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-xs font-medium text-gray-700">
                Save As
              </Label>
              <Controller
                name="saveAs"
                control={form.control}
                render={({ field }) => (
                  <Select
                    options={SAVE_AS_OPTIONS}
                    placeholder="Select SaveAs Address"
                    value={
                      ["Home", "Office"].includes(field.value)
                        ? SAVE_AS_OPTIONS.find(
                            option => option.value === field.value
                          )
                        : { value: "Other", label: "Other" }
                    }
                    onChange={handleSaveAsChange}
                    styles={SELECT_STYLES}
                    components={{ IndicatorSeparator: () => null }}
                  />
                )}
              />

              {!isOtherSelected && form.formState.errors.saveAs && (
                <p className="text-[#D80A0A] text-[14px] font-poppins mt-1">
                  {form.formState.errors.saveAs.message}
                </p>
              )}

              {isOtherSelected && (
                <div className="grid gap-2 py-2 mt-2">
                  <Label className={LABEL_CLASS}>Other</Label>
                  <InputBox
                    type="text"
                    name="saveAs"
                    placeholder="Type other address type"
                    className={INPUT_CLASS}
                    form={form}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-5">
              <Button
                disabled={disableBtn}
                type="submit"
                className="w-full h-[56px] bg-green-custom hover:bg-green-custom text-xs font-poppins py-5 rounded-[88px] font-medium"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddress;
