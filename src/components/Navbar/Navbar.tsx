"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import { useCart } from "@/context/CartContext";
import { useLoginModal } from "@/store/loginModal";

import { Button } from "../ui/button";

import AddedToCart from "./AddedToCart/AddedToCart";

const Navbar = () => {
  const { isModalOpen, setIsModalOpen } = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const routePathname = usePathname();
  const { setCartQuantity } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  type itemT = {
    name: string;
    link: string;
    id: string;
  };

  const navbarItems: itemT[] = [
    {
      name: "Our Store",
      link: "/product/smart-rings/ourstore",
      id: "our-store",
    },
    {
      name: "Blogs",
      link: "/blog",
      id: "blogs",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const parsedValue = JSON.parse(loggedInUser);
      setLoggedIn(parsedValue?.email);
    }
  }, [loggedIn, isModalOpen]);

  const handleLogout = async () => {
    if (loggedIn) {
      localStorage.removeItem("loggedInUser");
      localStorage.clear();
      setLoggedIn("");
      setCartQuantity(0);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => setIsOpen(false);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isOpen]);
  
  if (!mounted) {
    // Avoid rendering mismatched HTML during SSR
    return null;
  }

  return (
    <div className=" text-white absolute top-[-10px] w-full px-2 lg:px-8 z-50 bg-transparent lg:bg-transparent">
      <div className="max-w-7xl mx-auto sm:px-6 md:px-8 lg:px-0 ">
        <div className="relative flex items-center justify-between py-6">
          <div className="w-[217px] h-[68px]">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/baai-logo.svg"
                width={38}
                height={68}
                quality={100}
                alt="BAAI Logo"
              />
              <h2 className="font-mulish text-[17px] sm:text-[24px]  font-bold  leading-[100%] tracking-[1px]">
                BrainAlive AI
              </h2>
            </Link>
          </div>

          <div className="hidden lg:flex mt-[8px] ml-[125px]">
            <div className="flex items-center space-x-4 xl:space-x-9 ">
              {navbarItems.map((item, index) => (
                <Link
                  href={item.link}
                  className="hover:text-gray-300 font-poppins font-light lg:text-[14px] xl:text-xs  "
                  key={index}
                >
                  <button
                    id={item.id}
                    className="text-white font-poppins font-light leading-[100%] lg:text-[14px] xl:text-[16px] p-0 m-0"
                  >
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex lg:gap-3 xl:gap-8 items-center">
            {loggedIn ? (
              <>
                <Button
                  onClick={() => {
                    handleLogout();
                    router.replace("/product/baai-zen-smart-rings");
                  }}
                  className="w-[136px] h-[56px] bg-transparent hover:bg-transparent leading-[180%] tracking-[0px] px-[40px] py-[15px] border border-[#ffffff] rounded-[88px] text-[#ffffff] text-[16px] font-poppins"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-[136px] h-[56px] bg-transparent hover:bg-transparent leading-[180%] tracking-[0px] px-[40px] py-[15px] border border-[#ffffff] rounded-[88px] text-[#ffffff] text-[16px] font-poppins"
                >
                  Login
                </Button>
              </>
            )}
            <Link
              href="/product/smart-rings/select-rings"
              id="buy-ring"
              className="w-[194px] h-[56px] bg-[#25b021] text-[#ffffff] text-[16px] px-14 py-4 rounded-[88px] font-poppins font-medium leading-[180%] tracking-[0px]"
            >
              Buy Ring
            </Link>
            {routePathname !== "/product/smart-rings/cart-page" && (
              <AddedToCart />
            )}
          </div>

          <div className="lg:hidden flex gap-3 items-center">
            {routePathname !== "/product/baai-zen-smart-rings/cart-page" && (
              <AddedToCart />
            )}

            <div>
              <button
                type="button"
                onClick={toggleMenu}
                className="text-white hover:text-gray-400 focus:outline-none"
              >
                {isOpen ? (
                  <AiOutlineClose size={24} />
                ) : (
                  <AiOutlineMenu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className={`lg:hidden fixed top-0 right-0 bottom-0 w-full bg-black  p-3 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-1000 ease-in-out z-50`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="">
              <Link
                href="/product/baai-zen-smart-rings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/baai-logo.svg"
                  width={40}
                  height={40}
                  alt="BrainAlive Logo"
                  quality={100}
                />
                <h2 className="font-mulish text-[17px]  font-bold  leading-[100%] ">
                  BrainAlive AI
                </h2>
              </Link>
            </div>

            <div className="lg:hidden flex flex-row gap-5 justify-end items-center">
              <AddedToCart />
              <div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Menu"
                  className="text-[#ffffff]"
                >
                  <AiOutlineClose size={30} />
                </button>
              </div>
            </div>
          </div>
          {/* Menu content */}
          <div className="space-y-1 px-2 pb-3 mt-6 sm:px-3">
            {navbarItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="block text-left text-[18px] font-poppins font-light leading-[100%] text-[#FFFFFF] hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md"
              >
                <button className="py-2 m-0">{item.name}</button>
              </Link>
            ))}

            <div
              className=" inline-block w-full"
              onClick={() => setIsOpen(false)}
            >
              {loggedIn ? (
                <Button
                  onClick={() => {
                    handleLogout();
                    router.replace("/product/baai-zen-smart-rings");
                  }}
                  className=" w-[136px] h-[56px] block border bg-transparent hover:bg-transparent text-center text-[16px] border-white text-white font-poppins font-medium px-4 py-2  mt-2 rounded-full"
                >
                  Log out
                </Button>
              ) : (
                <Button
                  onClick={(e: any) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                    setIsOpen(false);
                  }}
                  className=" w-[136px] h-[56px] block border bg-transparent hover:bg-transparent text-center text-[16px] border-white text-white font-poppins font-medium px-4 py-2 mt-2 rounded-full"
                >
                  Login
                </Button>
              )}

              <Link
                href="/product/smart-rings/select-rings"
                onClick={() => setIsOpen(false)}
                id="buy-ring-navbar"
                className="w-[194px] h-[56px] pt-3 block text-center text-[16px] font-poppins font-medium bg-green-custom text-white  mt-5 rounded-full leading-[180%]"
              >
                Buy Ring
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
