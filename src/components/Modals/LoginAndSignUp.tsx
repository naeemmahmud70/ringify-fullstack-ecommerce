import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// import { sentOtp, userLogin } from "@/api/users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import InputBox from "@/components/ui/InputBox";
import { Login, sendOtp } from "@/services/auth";
import { useToastStore } from "@/store/toast";
import { useLoggedInUser } from "@/store/users";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import CircularLoader from "../ui/CircularLoader";
import { Label } from "../ui/label";

import Congrats from "./Congrats";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import VerifyOtp from "./VerifyOtp";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email address.",
    }),
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
});

const signUpSchema = z.object({
  name: z.string().min(4, { message: "Name should be atlest 4 character" }),
  email: z
    .string()
    .min(1, { message: "Please enter your email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email address.",
    }),
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
});
const LoginAndSignUp: React.FC<{
  isAuthModalOpen: boolean;
  backgroundPath: string;
  setIsAuthModalOpen: (value: boolean) => void;
}> = ({ isAuthModalOpen, backgroundPath, setIsAuthModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [openForgetPass, setOpenForgetPass] = useState(false);
  const [openCongrats, setOpenCongrats] = useState(false);
  const [openResetPass, setOpenResetPass] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { SetToastStates } = useToastStore();
  const { setLoggedInUser } = useLoggedInUser();
  const [signUpdata, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const schema = useMemo(() => {
    return authMode === "login" ? loginSchema : signUpSchema;
  }, [authMode]);

  useEffect(() => {
    const mode = pathname === "/login" ? "login" : "signUp";
    setAuthMode(mode);
  }, [pathname]);

  const handleClose = () => {
    router.push(backgroundPath);
    setIsAuthModalOpen(false);
  };

  const forms = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: any) {
    if (authMode === "login") {
      handleLogin(values);
    } else {
      handleSignUp(values);
    }
  }

  const isCartRoute = backgroundPath?.includes("/cart");

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const data = await Login(values);
      setLoading(false);
      if (data?.status == 200) {
        setLoggedInUser({
          name: data?.user?.name,
          email: data?.user?.email,
          id: data?.user?.id,
        });
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));

        SetToastStates({
          message: data.message,
          variant: "success",
          triggerId: Date.now(),
        });
        setIsAuthModalOpen(false);
        if (isCartRoute) {
          router.push("/product/smart-rings/checkout");
        } else {
          router.push(backgroundPath);
        }
      } else {
        SetToastStates({
          message: data.message,
          variant: "error",
          triggerId: Date.now(),
        });
      }
    } catch (error: any) {
      setLoading(false);
      SetToastStates({
        message: error.message || "Something went wrong!",
        variant: "error",
        triggerId: Date.now(),
      });
    }
  };
  const handleSignUp = async (values: any) => {
    try {
      setLoading(true);
      const data = await sendOtp(values);
      setLoading(false);
      if (data?.status === 200) {
        setSignUpData(data?.user);
        setOpenOtp(true);
      } else {
        SetToastStates({
          message: data?.message,
          variant: "error",
          triggerId: Date.now(),
        });
        console.log(data);
      }
    } catch (error: any) {
      console.log("err", error);
      setLoading(false);
      SetToastStates({
        message: error,
        variant: "error",
        triggerId: Date.now(),
      });
    }
  };

  const handleOpenForgetPass = () => {
    setOpenForgetPass(true);
  };

  useEffect(() => {
    forms.reset();
  }, [authMode, isAuthModalOpen]);

  return (
    <>
      <Dialog open={isAuthModalOpen} onOpenChange={handleClose}>
        {!openOtp && !openForgetPass && !openResetPass && (
          <DialogContent className="bg-[#030D0D] max-w-[456px]  p-5 md:p-10 border-none rounded-3xl md:rounded-3xl ">
            <DialogHeader>
              <DialogTitle className="text-[28px] text-white font-mulish font-extrabold text-center tracking-wide leading-8">
                Let’s Get Started
              </DialogTitle>
              <DialogDescription
                style={{ marginTop: "15px", marginBottom: "15px" }}
                className="text-[#FFFFFF73] text-xs font-poppins font-normal leading-[22px] text-center"
              >
                Access your account or create a new one in <br /> seconds.
              </DialogDescription>

              <X
                onClick={handleClose}
                className="bg-transparent hover:bg-transparent text-white absolute right-5 top-2 h-6 w-6 cursor-pointer"
              />
            </DialogHeader>
            <div className="w-full bg-[#FFFFFF14] rounded-full p-[6px]">
              <Link
                href="/login"
                className={`w-[50%] inline-block rounded-full text-center text-white text-[14px] font-poppins font-medium py-3 ${authMode === "login" ? "bg-[#25B021] hover:bg-[#25B021]" : "bg-transparent hover:bg-transparent"}`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`w-[50%] inline-block text-center rounded-full text-white text-[14px] font-poppins font-medium py-3 ${authMode === "signUp" ? "bg-[#25B021] hover:bg-[#25B021]" : "bg-transparent hover:bg-transparent"}`}
              >
                Sign Up
              </Link>
            </div>

            <Form {...forms}>
              <form autoComplete="off" onSubmit={forms.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                  {authMode === "signUp" && (
                    <div>
                      <Label className="text-xs text-[#FFFFFF7A] font-poppins font-normal pb-2 inline-block [29px] mt-2">
                        Name
                      </Label>

                      <InputBox
                        name="name"
                        placeholder="John Doe"
                        autoComplete="off"
                        className="bg-[#FFFFFF14] text-white w-full p-5 h-12 rounded-full border-[#FFFFFF66] text-xs font-poppins placeholder:text-xs pl-6"
                        type="text"
                        form={forms}
                      />
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-[#FFFFFF7A] font-poppins font-normal pb-2 inline-block ">
                      Email ID
                      {authMode === "signUp" && (
                        <span className="text-[#FF0909]">*</span>
                      )}
                    </Label>
                    <InputBox
                      name="email"
                      placeholder="email"
                      autoComplete="off"
                      className="bg-[#FFFFFF14] text-white w-full h-12 rounded-full border-[#FFFFFF66] text-xs font-poppins font-normal placeholder:text-xs pl-6"
                      form={forms}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-[#FFFFFF7A] font-poppins font-normal pb-2 inline-block">
                      Enter Password
                    </Label>

                    <InputBox
                      name="password"
                      placeholder="Password"
                      autoComplete="off"
                      className="bg-[#FFFFFF14] text-white w-full p-5 h-12 rounded-full border-[#FFFFFF66] text-xs font-poppins placeholder:text-xs pl-6"
                      type="password"
                      form={forms}
                    />
                  </div>

                  {authMode === "login" && (
                    <div className="flex justify-end">
                      <Link
                        href="#"
                        onClick={handleOpenForgetPass}
                        className="bg-transparent border-0 text-xs font-normal font-poppins text-white"
                      >
                        Forget Password?
                      </Link>
                    </div>
                  )}

                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#25B021] hover:bg-[#25B021] text-[14px] font-normal py-7 px-10 rounded-xl font-poppins h-11"
                  >
                    {loading ? <CircularLoader /> : "Continue"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        )}
        {openOtp && !openCongrats && (
          <VerifyOtp
            openOtp={openOtp}
            signUpdata={signUpdata}
            setOpenOtp={setOpenOtp}
            setIsAuthModalOpen={setIsAuthModalOpen}
            setOpenCongrats={setOpenCongrats}
          />
        )}
        {openCongrats && (
          <Congrats
            openCongrats={openCongrats}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />
        )}
        {openForgetPass && (
          <ForgetPassword
            setResetEmail={setResetEmail}
            setOpenResetPass={setOpenResetPass}
            setOpenForgetPass={setOpenForgetPass}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />
        )}
        {openResetPass && (
          <ResetPassword
            resetEmail={resetEmail}
            setOpenResetPass={setOpenResetPass}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />
        )}
      </Dialog>
    </>
  );
};

export default LoginAndSignUp;
