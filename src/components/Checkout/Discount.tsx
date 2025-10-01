import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { applyDiscountCode } from "@/services/discount";
import { useToastStore } from "@/store/toast";
import { zodResolver } from "@hookform/resolvers/zod";

import editIcon from "../../../public/products/editDiscountCode.svg";
import { OfferT } from "../Cart/CartItems";
import { Button } from "../ui/button";
import CircularLoader from "../ui/CircularLoader";
import { Form } from "../ui/form";
import InputBox from "../ui/InputBox";

const schema = z.object({
  code: z
    .string()
    .min(6, { message: "Discount code should be atleast 6 character!" }),
});

interface OrderSummaryProps {
  setDiscount: (value: number) => void;
  freeRings: number;
  selectedOffer: OfferT;
}

const Discount: React.FC<OrderSummaryProps> = ({
  freeRings,
  selectedOffer,
  setDiscount,
}) => {
  const { SetToastStates } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const forms = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setLoading(true);
      const data = await applyDiscountCode(values);
      setLoading(false);
      if (data?.status === 200) {
        setDiscount(data.discount);
        setEdit(true);
        SetToastStates({
          message: data.message,
          variant: "success",
          triggerId: Date.now(),
        });
      } else {
        setDiscount(0);
        SetToastStates({
          message: data.message,
          variant: "error",
          triggerId: Date.now(),
        });
      }
    } catch (err: any) {
      setLoading(false);
      SetToastStates({
        message: err.message || "Something went wwwrong!",
        variant: "error",
        triggerId: Date.now(),
      });
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center border border-[#FFFFFF33] h-[74px] md:h-[88px] rounded-xl  ">
        {(freeRings > 0 && selectedOffer.PROMO_OFFER_1) ||
        selectedOffer.PROMO_OFFER_2 ? (
          <div className="flex justify-between items-center w-full max-w-[90%]  mx-auto mb-4  py-1 rounded-xl mt-4 origin-top">
            <div className="flex items-center gap-2">
              <Image
                width={24}
                height={24}
                src="/cartpage/Discount Arrow.svg"
                alt="Discount Icon"
                className="w-[24px] h-[24px] justify-self-start"
              />
              <p className="text-[16px] md:text-[18px] text-white font-poppins font-normal">
                {selectedOffer.PROMO_OFFER_1
                  ? selectedOffer.PROMO_OFFER_1
                  : selectedOffer.PROMO_OFFER_2}
              </p>
            </div>

            <Button
              disabled={
                selectedOffer.PROMO_OFFER_1 || selectedOffer.PROMO_OFFER_2
                  ? true
                  : false
              }
              className="text-[#FFFFFF] text-[16px] font-poppins  font-medium bg-transparent hover:bg-transparent  rounded-full border border-green-custom inline-block"
            >
              Applied
            </Button>
          </div>
        ) : (
          <div className=" w-full max-w-[90%]  mx-auto  py-1 rounded-xl origin-top">
            <Form {...forms}>
              <form
                autoComplete="off"
                onSubmit={forms.handleSubmit(onSubmit)}
                className="flex items-center justify-between p-0"
              >
                <InputBox
                  name="code"
                  placeholder="Use naeem10 as discount code"
                  readOnly={edit ? true : false}
                  autoComplete="off"
                  className={`bg-transparent min-w-[300px]  ${edit ? " text-gray-400" : "text-white"} px-0 h-full rounded-full border-0 text-xs font-poppins font-normal placeholder:text-xs`}
                  form={forms}
                />

                {edit ? (
                  <div
                    onClick={() => setEdit(false)}
                    className="flex gap-2 bg-[#25B021] hover:bg-[#25B021] text-[14px] font-normal py-[10px] px-4 rounded-xl font-poppins"
                  >
                    Edit{" "}
                    <Image
                      src={editIcon}
                      height={12}
                      width={12}
                      alt="edit-icon"
                    />
                  </div>
                ) : (
                  <Button
                    disabled={loading}
                    type="submit"
                    className=" bg-[#25B021] hover:bg-[#25B021] text-[14px] font-normal py-1 px-4 rounded-xl font-poppins"
                  >
                    {loading ? <CircularLoader /> : "Apply"}
                  </Button>
                )}
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discount;
