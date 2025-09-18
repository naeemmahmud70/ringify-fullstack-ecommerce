import React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { forgetPassword } from "@/api/users";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendForgetPassOtp } from "@/services/auth";
import { useLoading } from "@/store/loading";
import { useAuthModal } from "@/store/loginModal";
import { useToastStore } from "@/store/toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import CircularLoader from "../ui/CircularLoader";
import { Form } from "../ui/form";
import InputBox from "../ui/InputBox";
import { Label } from "../ui/label";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email address.",
    }),
});

const ForgetPassword: React.FC<{
  setResetEmail: (value: string) => void;
  setIsAuthModalOpen: (value: boolean) => void;
  setOpenResetPass: (value: boolean) => void;
  setOpenForgetPass: (value: boolean) => void;
}> = ({
  setResetEmail,
  setOpenResetPass,
  setIsAuthModalOpen,
  setOpenForgetPass,
}) => {
  const { loading, setLoading } = useLoading.getState();
  const { backgroundPath } = useAuthModal();
  const router = useRouter();
  const { SetToastStates } = useToastStore();

  const forms = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setLoading(true);
      const data = await sendForgetPassOtp(values);
      console.log("data", data);
      setLoading(false);
      if (data?.status === 200) {
        SetToastStates({
          message: "OTP sent to your email",
          variant: "success",
          triggerId: Date.now(),
        });
        setResetEmail(data?.email);
        setOpenForgetPass(false);
        setOpenResetPass(true);
      } else {
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

  const handleClose = () => {
    setOpenForgetPass(false);
    setIsAuthModalOpen(false);
    router.push(backgroundPath);
  };
  return (
    <DialogContent className="bg-[#030D0D] max-w-[456px]  p-5 md:p-10 border-none rounded-3xl md:rounded-3xl max-h-[80vh] sm:max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-[28px] text-white font-mulish font-extrabold text-center tracking-wide leading-8">
          Forgot Password
        </DialogTitle>
        <DialogDescription
          style={{ marginTop: "15px", marginBottom: "15px" }}
          className="text-[#FFFFFF73] text-xs font-poppins font-normal leading-[22px] text-center"
        >
          Forgot password? No worries, we’ll send you reset instructions
        </DialogDescription>

        <X
          onClick={handleClose}
          className="bg-transparent hover:bg-transparent text-white absolute right-5 top-5 h-6 w-6 cursor-pointer"
        />
      </DialogHeader>
      <Form {...forms}>
        <form autoComplete="off" onSubmit={forms.handleSubmit(onSubmit)}>
          <div className="">
            <Label className="text-xs text-[#FFFFFF7A] font-poppins font-normal pb-2 inline-block leading-[29px]">
              Email ID
            </Label>
            <InputBox
              name="email"
              placeholder="email"
              autoComplete="off"
              className="bg-[#FFFFFF14] text-white w-full h-12 rounded-full border-[#FFFFFF66] text-xs font-poppins font-normal placeholder:text-xs pl-6"
              form={forms}
            />
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-[#25B021] hover:bg-[#25B021] text-[14px] font-normal py-7 px-10 rounded-xl font-poppins h-11 mt-7"
          >
            {loading ? <CircularLoader /> : "Send Otp"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ForgetPassword;
