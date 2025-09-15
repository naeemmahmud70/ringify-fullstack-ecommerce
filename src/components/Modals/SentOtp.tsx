import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import OtpInput from "react-otp-input";

// import { sentOtp, verifyOtp } from "@/api/users";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import CircularLoader from "../ui/CircularLoader";

const SentOtp: React.FC<{
  email: string;
  openOtp: boolean;
  telegram: string;
  setOpenOtp: (value: boolean) => void;
  setIsAuthModalOpen: (value: boolean) => void;
  setOpenCongrats: (value: boolean) => void;
}> = ({
  email,
  openOtp,
  telegram,
  setOpenOtp,
  setIsAuthModalOpen,
  setOpenCongrats,
}) => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sentAgain, setSentAgain] = useState(false);
  const [restartTimer, setRestartTimer] = useState(false);
  const [successOtp, setSuccessOtp] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkoutParams = searchParams.get("checkout");

  const handleClose = () => {
    setIsAuthModalOpen(false);
  };

  const handleBack = () => {
    setOpenOtp(false);
  };

  const submittingRef = React.useRef(false);
  const handleOtpSubmit = async () => {
    if (submittingRef.current) {
      return;
    }
    submittingRef.current = true;

    const verifyPayload = {
      email: email,
      otp: otp.toString(),
    };

    // try {
    //   setLoading(true);
    //   const data = await verifyOtp(verifyPayload);
    //   console.log("signup page", data);
    //   if (data?.email) {
    //     setSuccessOtp(true);
    //     localStorage.setItem(
    //       "loggedInUser",
    //       JSON.stringify({
    //         email: data.email,
    //         id: data.userId,
    //         sessionToken: data.auth.token,
    //         accountId: data.auth.accountId,
    //       })
    //     );
    //     if (checkoutParams) {
    //       router.push("/product/baai-zen-smart-rings/checkout-page");
    //     }
    //     setOpenCongrats(true);
    //   } else {
    //     setSuccessOtp(false);
    //     setInvalidOtp(true);
    //   }
    // } catch (err) {
    //   console.log("err", err);
    // } finally {
    //   setLoading(false);
    //   submittingRef.current = false;
    // }
  };

  const handleResentOtp = async () => {
    setRestartTimer(!restartTimer);
    setSentAgain(true);
    setInvalidOtp(false);
    setOtp("");
    const payload = {
      email: email,
      telegram: telegram,
    };
    console.log("payload", payload);
    // try {
    //   setLoading(true);
    //   const data = await sentOtp(payload);
    //   setLoading(false);
    //   if (data?.status === 200) {
    //     setOpenOtp(true);
    //   }
    // } catch (err) {
    //   console.log("err", err);
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (openOtp) {
      setTimeLeft(30); // Reset timer every time modal opens
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [openOtp, restartTimer]);
  console.log("otp loading", loading);
  return (
    <>
      <DialogContent className="bg-[#030D0D] max-w-[452px]  p-5 md:px-10 md:py-5 border-none rounded-3xl md:rounded-3xl max-h-[80vh] sm:max-h-[90vh]">
        <DialogHeader className="">
          <ArrowLeft
            onClick={handleBack}
            className="bg-transparent hover:bg-transparent text-white absolute left-5 top-7 w-6 cursor-pointer"
          />
          <DialogTitle className="text-[28px] text-white font-mulish font-extrabold text-center tracking-wide leading-8">
            {sentAgain ? "OTP sent again" : "Verify your email"}
          </DialogTitle>
          <DialogDescription
            style={{ marginTop: "15px", marginBottom: "15px" }}
            className="text-[#FFFFFF73] text-xs font-poppins font-normal leading-[22px] text-center"
          >
            Enter the 6-digit OTP sent to <br />{" "}
            <span className="text-white">{email}</span>
          </DialogDescription>

          <X
            onClick={handleClose}
            className="bg-transparent hover:bg-transparent text-white absolute right-5 top-5 h-6 w-6 cursor-pointer"
          />
        </DialogHeader>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          shouldAutoFocus
          renderSeparator={<span>--</span>}
          renderInput={(props: any, index: number) => (
            <input
              {...props}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              style={{ color: "white" }}
              className={`bg-[#172020] text-white border ${invalidOtp ? "border-[#D80A0A]" : "border-[#FFFFFF66]"} rounded-lg w-[52px] h-[60px] text-center text-xs font-poppins`}
              onKeyDown={e => {
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab"
                ) {
                  e.preventDefault();
                }
              }}
              onPaste={
                index === 0
                  ? e => {
                      e.preventDefault();
                      const paste = e.clipboardData
                        .getData("text")
                        .trim()
                        .slice(0, 6);
                      if (/^\d{1,6}$/.test(paste)) {
                        setOtp(paste);
                      }
                    }
                  : undefined
              }
            />
          )}
        />
        {invalidOtp && (
          <p className="text-[#D80A0A] text-[14px] font-poppins leading-5 -mt-2">
            Invalid Code. Please retry.
          </p>
        )}
        <Button
          onClick={handleOtpSubmit}
          disabled={loading || successOtp || otp.length > 5 ? false : true}
          className="w-full bg-[#25B021] hover:bg-[#25B021] text-[14px] font-normal py-7 px-10 rounded-xl font-poppins h-11 mt-1"
        >
          {loading ? <CircularLoader /> : "Verify Code"}
        </Button>

        <div className="leading-[22px]">
          <p
            style={{ lineHeight: "22px" }}
            className="text-xs text-[#FFFFFF73] font-poppins text-center leading-[22px] h-[22px] mb-3 flex justify-center items-center"
          >
            {timeLeft > 0 ? (
              <span>Resend Code in :</span>
            ) : (
              <span>Didn’t receive the code?</span>
            )}

            {timeLeft > 0 ? (
              <span className="text-[#FFFF00] px-1">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft} Sec
              </span>
            ) : (
              <Button
                disabled={loading}
                onClick={() => {
                  handleResentOtp();
                  setTimeLeft(30);
                }}
                className="bg-transparent hover:bg-transparent border-0 text-xs font-semibold font-poppins text-[#25B021] m-0 px-1 leading-[22px]"
              >
                Resend Now
              </Button>
            )}
          </p>
        </div>
      </DialogContent>
    </>
  );
};

export default SentOtp;
