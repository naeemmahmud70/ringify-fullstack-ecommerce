"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { deleteAddress, getAddresses } from "@/services/addresses";
import { useLoading } from "@/store/loading";
import { useModals } from "@/store/modals";
import { useToastStore } from "@/store/toast";
import { useLoggedInUser } from "@/store/users";

import edit from "../../../public/add-icon.png";
import add from "../../../public/add-icon.svg";
import delet from "../../../public/Close.svg";

interface Item {
  _id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  state: string;
  pincode: string;
  contactNumber: string;
  isSelectedAddress: boolean;
  saveAs: string;
}
interface AddressProps {
  setSelectedAddress: (value: string) => void;
}
const AddressSelection: React.FC<AddressProps> = ({ setSelectedAddress }) => {
  const {
    addAddressForm,
    editAddressForm,
    setAddAddress,
    setEditAdressForm,
    setEditFormValue,
  } = useModals();
  const [data, setData] = useState<Item[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isDeleted, setIsdeleted] = useState(false);
  const { loggedInUser } = useLoggedInUser();
  const { SetToastStates } = useToastStore();
  const { loading, setLoading } = useLoading();

  const getAddressListData = async () => {
    try {
      setLoading(true);
      const res = await getAddresses(loggedInUser?.email);

      if (res.status == 200) {
        setData(res.data);
        setSelectedAddressId(null);
        setSelectedAddress("");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddressListData();
  }, [addAddressForm, editAddressForm, isDeleted]);

  useEffect(() => {
    if (data?.length) {
      const preselectedAddress = data?.find(addr => addr.isSelectedAddress);
      if (preselectedAddress) {
        setSelectedAddressId(preselectedAddress?._id);
        setSelectedAddress(getFullAddress(preselectedAddress));
      }
    }
  }, [data]);

  const handleAddressChange = (addr: Item) => {
    setSelectedAddressId(addr._id);
    setSelectedAddress(getFullAddress(addr));
  };

  const getAddressTitle = (address: Item) => {
    return [address.addressLine1, address.addressLine2]
      .filter(Boolean)
      .join(", ")
      .replace(/,([^,]*)$/, " - $1");
  };

  const getFullAddress = (address: Item) => {
    return [
      address.firstName,
      address.lastName,
      address.contactNumber,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.pincode,
      address.state,
      address.country,
      address.saveAs,
    ]
      .filter(Boolean)
      .join(", ")
      .replace(/,([^,]*)$/, " - $1");
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await deleteAddress(id);
      if (res.status == 200) {
        setIsdeleted(isDeleted => !isDeleted);
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
        message: error.message || "Something went wrong!",
        variant: "error",
        triggerId: Date.now(),
      });
    }
  };
  // dfkjskgnsdfgjkdfjkgljerijhnvejfl;kfda;sdl
  return (
    <div className="flex flex-col justify-between  h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-5 ">
          {data?.length ? (
            <div>
              {" "}
              {data?.map(addr => (
                <label
                  key={addr._id}
                  className={`flex space-x-4  ${
                    selectedAddressId === addr._id
                      ? "bg-[#2E2E2E] text-[#FFFFFF]"
                      : "bg-[#1F1F1F] text-[#FFFFFFC2]"
                  } rounded-md py-4 pl-0 pr-4 my-4 cursor-pointer`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={() => handleAddressChange(addr)}
                    className="peer hidden"
                    id="select-address"
                  />

                  {/* Custom styled radio circle */}
                  <div className="h-[24px] w-[24px] p-0 mt-1 rounded-[100%] border-2 border-white flex items-center justify-center">
                    <div
                      className={`h-[12px] w-[12px] p-0 m-1 rounded-[100%] ${selectedAddressId === addr._id ? "bg-white" : "bg-transparent"}  peer-checked:bg-white`}
                    ></div>
                  </div>

                  {/* Address details */}
                  <div className="flex justify-between items-start lg:items-center w-[95%] md:w-full">
                    <div className="w-[80%] md:w-[75%]">
                      <div className="text-[18px] font-normal font-poppins leading-[24px] break-words whitespace-normal flex  items-start  sm:gap-6">
                        {getAddressTitle(addr)}
                        {addr.saveAs && (
                          <span className=" w-fit h-[26px] bg-[#646667] rounded text-[12px] uppercase leading-[100%] font-medium px-2 py-1 font-poppins flex items-center mt-1 sm:mt-0">
                            {addr.saveAs}
                          </span>
                        )}
                      </div>

                      <p className="text-[16px]  font-normal font-poppins leading-[24px] mt-4 break-words whitespace-normal">
                        {getFullAddress(addr)}
                      </p>
                      <p className="text-[16px]  font-normal font-poppins leading-[24px] mt-2 break-words whitespace-normal">
                        {addr.contactNumber}
                      </p>
                    </div>
                    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-6 lg:items-center">
                      <Link
                        href="/product/smart-rings/checkout/edit-address"
                        className=" w-[24px] h-[24px] mx-auto lg:mx-0"
                        onClick={() => {
                          setEditFormValue({
                            id: addr._id,
                            firstName: addr.firstName,
                            lastName: addr.lastName,
                            addressLine1: addr.addressLine1,
                            addressLine2: addr.addressLine2,
                            country: addr.country,
                            state: addr.state,
                            city: addr.city,
                            pincode: addr.pincode,
                            contactNumber: addr.contactNumber,
                            saveAs: addr.saveAs,
                            isSelectedAddress: addr.isSelectedAddress,
                          });
                          setEditAdressForm(true);
                        }}
                      >
                        <Image src={edit} alt="edit-icon" className="w-[px]" />
                      </Link>
                      <button onClick={() => handleDeleteAddress(addr._id)}>
                        <Image
                          src={delet}
                          alt="edit-icon"
                          className="w-[24px] mx-auto lg:mx-0"
                        />
                      </button>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="w-full h-full font-poppins text-center flex items-center justify-center mt-[35%]">
              {loading ? (
                <p>Address loading...</p>
              ) : (
                <p>Add and select your address to complete your order.</p>
              )}
            </div>
          )}
        </div>

        <div className="w-full flex items-center gap-5 my-10">
          <div className="w-full border-b border-white h-[2px]"></div>
          <div className="w-full flex flex-col items-center">
            <Link
              onClick={() => setAddAddress(true)}
              href="/product/smart-rings/checkout/add-new-address"
              className=" bg-black p-1 rounded-full"
            >
              <Image src={add} alt="add-icon" className="w-[24px] h-[24px]" />
            </Link>

            <span className="text-[14px] text-[#CFFF65] font-poppins mt-2 font-normal leading-[16px] tracking-[0.00625em] block">
              Add Address
            </span>
          </div>
          <div className="w-full h-[2px] border-b border-white"></div>
        </div>

        {data?.length > 0 && (
          <div>
            <p className="text-[#FFFFFFB2] text-[16px] text-center  font-poppins font-normal mt-5">
              Delivery charges will be borne by the buyer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSelection;
