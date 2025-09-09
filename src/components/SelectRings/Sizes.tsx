import { Button } from "@/components/ui/button";

export interface selectedRingProps {
  size: string;
  quantity: number;
  color: string;
}

interface SizeProps {
  ringSizes: selectedRingProps[];
  ringColor: string;
  error: string;
  setError: (value: string) => void;
  setRingSizes: React.Dispatch<React.SetStateAction<selectedRingProps[]>>;
}

const Sizes: React.FC<SizeProps> = ({
  ringSizes,
  ringColor,
  error,
  setError,
  setRingSizes,
}) => {
  const SizeData = [
    { id: 1, size: "06" },
    { id: 2, size: "07" },
    { id: 3, size: "08" },
    { id: 4, size: "09" },
    { id: 5, size: "10" },
    { id: 6, size: "11" },
    { id: 7, size: "12" },
    { id: 8, size: "13" },
  ];

  const getTotalQuantity = () => {
    return ringSizes.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAddSize = (size: string) => {
    if (!ringColor) {
      setError("Select the color first");
      return;
    }

    const existsIndex = ringSizes.findIndex(
      r => r.size === size && r.color === ringColor
    );

    if (existsIndex !== -1) {
      // Remove only if both size and color match
      setRingSizes(prev => prev.filter((_, i) => i !== existsIndex));
    } else {
      const total = getTotalQuantity();
      if (total + 1 > 15) {
        setError("You cannot exceed more than 15 rings");
        return;
      }
      setRingSizes(prev => [...prev, { size, quantity: 1, color: ringColor }]);
      setError("");
    }
  };
  const increaseQuantity = (size: string, ringColor: string) => {
    const total = getTotalQuantity();
    if (total >= 15) {
      setError("Maximum 15 rings allowed at a time!");
      return;
    }
    setRingSizes(prev =>
      prev.map(r =>
        r.size === size && r.color === ringColor
          ? { ...r, quantity: r.quantity + 1 }
          : r
      )
    );
    setError("");
  };

  const decreaseQuantity = (size: string, ringColor: string) => {
    setRingSizes(
      prev =>
        prev
          .map(r => {
            if (r.size === size && r.color === ringColor) {
              if (r.quantity > 1) {
                return { ...r, quantity: r.quantity - 1 };
              } else {
                return null;
              }
            }
            return r;
          })
          .filter(Boolean) as selectedRingProps[]
    );
    setError("");
  };

  const formatColor = (color: string) => {
    const colorMap: Record<string, string> = {
      black: "Black",
      silver: "Silver",
      rosegold: "Rose Gold",
    };
    return colorMap[color.toLowerCase()] || color;
  };

  return (
    <div className="bg-[#131313] p-[20px] lg:p-[30px] lg:max-w-[564px] md:w-full rounded-xl">
      <p className="text-[#FFFFFFB2] text-base font-poppins font-semibold">
        Size
      </p>
      <div className="border-[1px] border-solid border-[#292929] mt-6 mb-8"></div>

      <div className="my-5 text-center">
        <p className="text-[14px] text-[#FFFFFFB2] font-poppins font-normal tracking-tight">
          For the perfect fit, we recommend using our{" "}
          <a
            href="#"
            target="_blank"
            className="text-[#CFFF65]"
          >
            E Sizing Guide
          </a>
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {SizeData.map(item => {
          const isSelected = ringSizes.some(
            r => r.size === item.size && r.color === ringColor
          );
          return (
            <div
              key={item.id}
              className={`bg-[#F5F5F50D] p-4 h-[56px] w-[56px] rounded-md cursor-pointer ${
                isSelected ? "border-[1px] border-[#FFFFFF66]" : ""
              }`}
              onClick={() => {
                handleAddSize(item.size);
              }}
            >
              <p className="text-white font-poppins font-normal text-center">
                {item.size}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-6">
        {ringSizes.map((ring, index) => (
          <div className="flex justify-between items-center" key={index}>
            <div>
              <p className="text-[#FFFFFFB2] text-[14px] font-poppins">
                Size: {ring.size} ({formatColor(ring.color)})
              </p>
            </div>

            <div className="flex items-center bg-[#F5F5F50D] rounded-full h-[32px] w-[91px]">
              <Button
                onClick={() => decreaseQuantity(ring.size, ring.color)}
                className="text-white text-base font-poppins font-normal bg-transparent hover:bg-transparent"
              >
                -
              </Button>
              <span className="text-white text-[14px] font-medium font-poppins">
                {ring.quantity}
              </span>
              <Button
                onClick={() => increaseQuantity(ring.size, ring.color)}
                className="text-white text-base font-poppins font-normal bg-transparent hover:bg-transparent"
              >
                +
              </Button>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="text-end">
          <p className="text-[#D80A0A] text-[14px] mt-4 font-poppins">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default Sizes;
