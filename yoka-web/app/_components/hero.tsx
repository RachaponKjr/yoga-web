import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";

import wane from "@/assets/images/banner/wavn1.png";
import yogaBanner from "@/assets/images/yoga/yoga-banner.jpg";
import polygrid from "@/assets/svg/polygrid.svg";

const Hero = () => {
  return (
    // bg-linear-to-b from-[#dfddc6]  to-[#18281E]
    <div className="relative py-12 md:py-0">
      <Image
        src={polygrid}
        alt=""
        quality={100}
        fill
        className="object-cover opacity-70"
      />
      <div className="h-[calc(100dvh-10rem)] container mx-auto mb-8 md:mb-0 px-4 md:px-6 flex flex-col md:flex-row items-center justify-center gap-0 md:gap-16 2xl:relative">
        <div className="max-w-2xl 2xl:max-w-3xl flex flex-col gap-4 md:gap-8 z-50">
          <h1 className="text-[clamp(4rem,12vw,6rem)] font-serif leading-none font-bold bg-linear-to-r from-tertiary via-primary to-secondary bg-clip-text text-transparent">
            Yoga by Niti
          </h1>
          <div className="flex flex-col gap-2 md:gap-4">
            <span className="text-lg md:text-2xl text-[#132B28]">
              Studio & Clean Food Kitchen
            </span>
            <p className="text-[#666666] text-sm md:text-lg max-w-2xl">
              Experience a complete wellness journey. Join Niti for expert-led
              yoga sessions and nourish your body afterwards with our signature
              clean food, crafted for your health.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant={"default"}
              size={"lg"}
              className="rounded-full text-white bg-[#3D552F] hover:bg-[#3D552F] cursor-pointer"
            >
              Booking Now <Icon icon="mdi:arrow-right" />
            </Button>
            <Button
              variant={"outline"}
              size={"lg"}
              className="rounded-full bg-transparent hover:bg-tertiary/20 hover:text-tertiary cursor-pointer border-tertiary/20!"
            >
              Sign Up
            </Button>
          </div>
        </div>

        <div className="relative w-full md:w-full md:max-w-3xl">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* 1. กำหนด ID ให้กับ Clip Path */}
              <clipPath id="blob-shape">
                <path
                  d="M46.1,-71.7C58.4,-63.8,66,-48.7,70.1,-33.8C74.2,-18.8,74.7,-4,73.5,11.2C72.4,26.5,69.6,42.2,61.8,56.4C54,70.6,41.1,83.2,25.7,87.8C10.4,92.4,-7.3,88.9,-22,81.6C-36.7,74.3,-48.3,63.1,-60.2,51.2C-72,39.2,-84.1,26.5,-86,12.4C-87.9,-1.6,-79.6,-17.1,-72.2,-32.9C-64.9,-48.7,-58.5,-64.9,-46.6,-73C-34.8,-81.1,-17.4,-81.1,-0.2,-80.8C16.9,-80.4,33.8,-79.6,46.1,-71.7Z"
                  transform="translate(100 100)"
                />
              </clipPath>
            </defs>

            {/* 2. ใส่รูปภาพ และอ้างอิง ID จากข้อ 1 */}
            <image
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#blob-shape)"
              href={yogaBanner.src}
            />
          </svg>
        </div>
      </div>
      <div className="w-full hidden md:block h-80 relative bottom-0 left-0">
        <Image src={wane} alt="" quality={100} fill className="object-cover" />
      </div>
      <div>
        <svg
          width="100%"
          id="svg"
          viewBox="0 0 1440 390"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 block md:hidden"
        >
          <path
            d="M 0,400 L 0,100 C 126.73684210526315,121.48325358851675 253.4736842105263,142.9665071770335 334,139 C 414.5263157894737,135.0334928229665 448.8421052631579,105.61722488038279 539,107 C 629.1578947368421,108.38277511961721 775.1578947368422,140.5645933014354 893,141 C 1010.8421052631578,141.4354066985646 1100.5263157894735,110.1244019138756 1187,98 C 1273.4736842105265,85.8755980861244 1356.7368421052633,92.9377990430622 1440,100 L 1440,400 L 0,400 Z"
            stroke="none"
            strokeWidth="0"
            fill="#283618"
            fillOpacity="0.53"
          ></path>
          <path
            d="M 0,400 L 0,233 C 95.52153110047851,239.13397129186603 191.04306220095702,245.26794258373207 286,230 C 380.956937799043,214.73205741626793 475.3492822966506,178.0622009569378 566,189 C 656.6507177033494,199.9377990430622 743.5598086124404,258.4832535885168 842,266 C 940.4401913875596,273.5167464114832 1050.4114832535884,230.00478468899522 1152,216 C 1253.5885167464116,201.99521531100478 1346.7942583732058,217.4976076555024 1440,233 L 1440,400 L 0,400 Z"
            stroke="none"
            strokeWidth="0"
            fill="#283618"
            fillOpacity="1"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
