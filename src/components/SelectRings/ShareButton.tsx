"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import shareIcon from "../../../public/products/shareButton.svg";
import { Button } from "../ui/button";

const ShareButton = () => {
  const [isMobileShareSupported, setIsMobileShareSupported] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    setIsMobileShareSupported(true);
    if (typeof window !== "undefined") {
      setFullUrl(window.location.href);
    }
  }, []);

  const handleMobileShare = async () => {
    try {
      await navigator.share({
        title: "Check this out!",
        url: fullUrl,
      });
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  };

  return (
    <div className="flex gap-3">
      {isMobileShareSupported ? (
        <Button
          onClick={handleMobileShare}
          className="bg-transparent hover:bg-transparent p-0 m-0 border-0"
        >
          <Image src={shareIcon} alt="share-icon" />
        </Button>
      ) : null}
    </div>
  );
};

export default ShareButton;
