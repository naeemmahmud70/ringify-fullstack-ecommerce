import React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resetPassword } from "@/services/auth";
import { useLoading } from "@/store/loading";
import { useAuthModal } from "@/store/loginModal";
import { useToastStore } from "@/store/toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import CircularLoader from "../ui/CircularLoader";
import { Form } from "../ui/form";
import InputBox from "../ui/InputBox";
import { Label } from "../ui/label";

const schema = z
  .object({
    otp: z.string().min(6, { message: "OTP must be at least 6 digit!" }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .max(15, {
        message: "Password must be at most 15 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/\d/, {
        message: "Password must contain at least one number",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword: React.FC<{
  resetEmail: string;
  setIsAuthModalOpen: (value: boolean) => void;
  setOpenResetPass: (value: boolean) => void;
}> = ({ resetEmail, setOpenResetPass, setIsAuthModalOpen }) => {
  const { loading, setLoading } = useLoading.getState();
  const { backgroundPath } = useAuthModal();
  const router = useRouter();
  const { SetToastStates } = useToastStore();

  const forms = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (resetEmail && values) {
      const resetPayload = {
        otp: values.otp,
        email: resetEmail,
        password: values.confirmPassword,
      };
      try {
        setLoading(true);
        const data = await resetPassword(resetPayload);
        setLoading(false);
        if (data?.status === 200) {
          SetToastStates({
            message: data.message,
            variant: "success",
            triggerId: Date.now(),
          });
          setOpenResetPass(false);
          setIsAuthModalOpen(false);
          setIsAuthModalOpen(false);
        } else {
          SetToastStates({
            message: data.message,
            variant: "error",
            triggerId: Date.now(),
          });
        }
      } catch (err: any) {
        SetToastStates({
          message: err.message || "Something went wrong",
          variant: "success",
          triggerId: Date.now(),
        });
        setLoading(false);
      }
    }
  }

  const handleClose = () => {
    setOpenResetPass(false);
    setIsAuthModalOpen(false);
    router.push(backgroundPath);
  };
  return (
    <DialogContent className="bg-[#030D0D] max-w-[456px]  p-5 md:p-10 border-none rounded-3xl md:rounded-3xl max-h-[80vh] sm:max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-[28px] text-white font-mulish font-extrabold text-center tracking-wide leading-8">
          Reset Password
        </DialogTitle>
        <X
          onClick={handleClose}
          className="bg-transparent hover:bg-transparent text-white absolute right-5 top-5 h-6 w-6 cursor-pointer"
        />
      </DialogHeader>
      <Form {...forms}>
        <form autoComplete="off" onSubmit={forms.handleSubmit(onSubmit)}>
          <div className="">
            <Label className="text-xs text-[#FFFFFF7A] font-poppins font-normal pb-2 inline-block leading-[29px]">
              Enter your OTP
            </Label>
            <InputBox
              name="otp"
              type="password"
              placeholder=""
              autoComplete="off"
              className="bg-[#FFFFFF14] text-white w-full h-12 rounded-full border-[#FFFFFF66] text-xs font-poppins font-normal placeholder:text-xs pl-6"
              form={forms}
            />
          </div>
          <div className="mt-3">
            <Label className="text-xs text-[#FFFFFF7A] font-poppins font-normal pb-1 inline-block leading-[29px]">
              New Password
            </Label>
            <InputBox
              name="password"
              type="password"
              placeholder=""
              autoComplete="off"
              className="bg-[#FFFFFF14] text-white w-full h-12 rounded-full border-[#FFFFFF66] text-xs font-poppins font-normal placeholder:text-xs pl-6"
              form={forms}
            />
          </div>
          <div className="mt-3">
            <Label className="text-xs text-[#FFFFFF7A] font-poppins font-normal pb-1 inline-block leading-[29px]">
              Confirm Password
            </Label>
            <InputBox
              name="confirmPassword"
              placeholder=""
              type="password"
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
            {loading ? <CircularLoader /> : "Save Password"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ResetPassword;
