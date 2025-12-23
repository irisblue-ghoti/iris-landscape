"use client";

import React from "react";
import Sidebar from "./sidebar";
import History from "../history";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import HistoryModal from "@/components/shared/history-modal";
import { usePathname } from "next/navigation";
import { appConfigAtom } from "@/stores/slices/config_store";
import { store } from "@/stores";

const examples = [
  {
    id: 1,
    route: "english-cards",
    img: "https://file.302.ai/gpt/imgs/20250421/6a11795fef2c41a6bb95eb00c2590787.jpg",
    height: 48,
  },
  {
    id: 2,
    route: "visual-recipe",
    img: "https://file.302.ai/gpt/imgs/50dc1f32282f695b6792ffb8c9220afe.png",
    height: 64,
  },
  {
    id: 3,
    route: "physical-destruction",
    img: "https://file.302.ai/gpt/imgs/873e90a3fca08e0e01c0baa3945386f8.png",
    height: 56,
  },
  {
    id: 4,
    route: "product-model",
    img: "https://file.302.ai/gpt/imgs/29a536ac9585230ab33bbddb43c2c8ca.png",
    height: 48,
  },
  {
    id: 5,
    route: "sculpture",
    img: "https://file.302.ai/gpt/imgs/3c64acdfb2778a8b426101297a59ce77.png",
    height: 48,
  },
  {
    id: 6,
    route: "relief",
    img: "https://file.302.ai/gpt/imgs/d4b4384836665d20c8a2580bd2e3495f.png",
    height: 48,
  },
  {
    id: 7,
    route: "3d-head-pose",
    img: "https://file.302.ai/gpt/imgs/f420fdb4dcf9f8c89b1d6b3189d2b7cc.png",
    height: 48,
  },
  {
    id: 8,
    route: "clay-model",
    img: "https://file.302.ai/gpt/imgs/bb14d0a068bad227867c428ebfded3c2.png",
    height: 48,
  },
  {
    id: 9,
    route: "clay-model",
    img: "https://file.302.ai/gpt/imgs/5f338198cc0e5cb2f5ea6db5bbdde50e.png",
    height: 48,
  },
  {
    id: 10,
    route: "passport-stamp",
    img: "https://file.302.ai/gpt/imgs/e6fc9093d5ee2cd38b06a7b547896105.png",
    height: 48,
  },
  {
    id: 11,
    route: "low-poly",
    img: "https://file.302.ai/gpt/imgs/aa93f83f8cc7620b0f01a144e5e98cf4.png",
    height: 48,
  },
  {
    id: 12,
    route: "isometric-scene",
    img: "https://file.302.ai/gpt/imgs/f70a49a0efeb55d0cbf2fb813c1e2ecd.png",
    height: 48,
  },
  {
    id: 13,
    route: "city-isometric-view",
    img: "https://file.302.ai/gpt/imgs/b2def6c8fb682ef7216b7f1cfdabdffa.png",
    height: 48,
  },
  {
    id: 14,
    route: "font-typography",
    img: "https://file.302.ai/gpt/imgs/c9dfbc22e2d5d366ae3af9e6a6ff53bc.png",
    height: 48,
  },
  {
    id: 15,
    route: "ancient-book",
    img: "https://file.302.ai/gpt/imgs/fbc2d514d2c9cc2ae97b248173b887ac.png",
    height: 48,
  },
  {
    id: 16,
    route: "pill-capsule",
    img: "https://file.302.ai/gpt/imgs/2cbb8dfa08c1699150fc95b5b068883b.png",
    height: 48,
  },
  {
    id: 17,
    route: "keycap",
    img: "https://file.302.ai/gpt/imgs/13dfe292fde50d2afc7c2f88e147c21d.png",
    height: 48,
  },
  {
    id: 18,
    route: "mini-3d-building",
    img: "https://file.302.ai/gpt/imgs/b60263271246dbae1ba7c7be6ba2cb91.png",
    height: 48,
  },
  {
    id: 19,
    route: "change-age",
    img: "https://file.302.ai/gpt/imgs/20250422/compressed_102b671b111e429ebb563355e86cb2d5.jpeg",
    height: 48,
  },
  {
    id: 20,
    route: "doll",
    img: "https://file.302.ai/gpt/imgs/2fd17be04b9ebf50cf5f28b52f2883f2.png",
    height: 48,
  },
  {
    id: 21,
    route: "3d-model",
    img: "https://file.302.ai/gpt/imgs/ad2b7df5325587c5a57ebb5c57a355df.png",
    height: 48,
  },
  {
    id: 22,
    route: "tweet",
    img: "https://file.302.ai/gpt/imgs/dff150281ec23ec2839e0841c8b61322.png",
    height: 54,
  },
  {
    id: 23,
    route: "double-exposure",
    img: "https://file.302.ai/gpt/imgs/83c616f658826d8e0abc449173121f7e.png",
    height: 48,
  },
  {
    id: 24,
    route: "hand-drawn-info-card",
    img: "https://file.302.ai/gpt/imgs/1a736b337445aa7c6124bac34d14424f.png",
    height: 48,
  },
  {
    id: 25,
    route: "lego-collection",
    img: "https://file.302.ai/gpt/imgs/1c7422a4f5fd695a23e27040934145d6.png",
    height: 48,
  },
  {
    id: 26,
    route: "micro-world",
    img: "https://file.302.ai/gpt/imgs/6f9331234596aaf3a14799a148f7514c.png",
    height: 48,
  },
  {
    id: 27,
    route: "cute-enamelled-pin",
    img: "https://file.302.ai/gpt/imgs/811819749e4894c1808acb5b118cc205.png",
    height: 48,
  },
  {
    id: 28,
    route: "q-version-3d-character",
    img: "https://file.302.ai/gpt/imgs/475429e0d08ecfeb9756c369897c73b4.png",
    height: 48,
  },
  {
    id: 29,
    route: "ghibli-style",
    img: "https://file.302.ai/gpt/imgs/6e8a14d589545de0bcd10306a7283df5.png",
    height: 28,
  },
  {
    id: 30,
    route: "sticker-design",
    img: "https://file.302.ai/gpt/imgs/9e288a69db2116b5dbaabb7b81b4119d.png",
    height: 48,
  },
  {
    id: 31,
    route: "emoji-generator",
    img: "https://file.302.ai/gpt/imgs/ce7334b63763fff375a9c518d5aa7a50.png",
    height: 48,
  },
  {
    id: 32,
    route: "handwriting-note",
    img: "https://file.302.ai/gpt/imgs/267fb2944b14f4b22305d54a6fb72748.png",
    height: 48,
  },
  {
    id: 33,
    route: "super-realistic-figure",
    img: "https://file.302.ai/gpt/imgs/6992e30a179bd3c22db29d419a46c786.png",
    height: 48,
  },
  {
    id: 34,
    route: "cloud-art",
    img: "https://file.302.ai/gpt/imgs/82c51384db60219663f4677558a4d65e.png",
    height: 48,
  },
  {
    id: 35,
    route: "brand-pill",
    img: "https://file.302.ai/gpt/imgs/df17db4854c16ab9ac40193771579698.png",
    height: 48,
  },
  {
    id: 36,
    route: "letter-box",
    img: "https://file.302.ai/gpt/imgs/6c5e62dc4f93123b42db0ada360bb65d.png",
    height: 48,
  },
  {
    id: 37,
    route: "original-product-image",
    img: "https://file.302.ai/gpt/imgs/b4950f4331a14a9e6d3f5a6f90d31915.png",
    height: 48,
  },
  {
    id: 38,
    route: "plastic-trash-bag",
    img: "https://file.302.ai/gpt/imgs/81b953191e77bcea0141c495e10edf46.png",
    height: 48,
  },
  {
    id: 39,
    route: "mini-scroll",
    img: "https://file.302.ai/gpt/imgs/1ed3326c81cdef70fc1f0e90db354c71.png",
    height: 48,
  },
  {
    id: 40,
    route: "shadow-art",
    img: "https://file.302.ai/gpt/imgs/29375853dec5cac0fea21db3caa5eac4.png",
    height: 48,
  },
  {
    id: 41,
    route: "cover-poster",
    img: "https://file.302.ai/gpt/imgs/70782585d35f0c3c1c0cac82421032fa.png",
    height: 48,
  },
  {
    id: 42,
    route: "crystal-ball",
    img: "https://file.302.ai/gpt/imgs/5f338198cc0e5cb2f5ea6db5bbdde50e.png",
    height: 48,
  },
  {
    id: 43,
    route: "mini-tilt-shift-landscape",
    img: "https://file.302.ai/gpt/imgs/583dd500af9c61a4e6dbcb2d4ceb0ecc.png",
    height: 48,
  },
  {
    id: 44,
    route: "q-version-keycap",
    img: "https://file.302.ai/gpt/imgs/3aaca61ad773806d6258c251b6a847b6.png",
    height: 48,
  },
  {
    id: 45,
    route: "mini-3d-shop",
    img: "https://file.302.ai/gpt/imgs/85426acfaa918b09b0d53ebe7593b595.png",
    height: 48,
  },
  {
    id: 46,
    route: "finger-nail-painting",
    img: "https://file.302.ai/gpt/imgs/6b6138d7c1bad3d433d0b1768dd2f762.png",
    height: 48,
  },
  {
    id: 47,
    route: "t-shirt-pin",
    img: "https://file.302.ai/gpt/imgs/12e556e7e98d9f5802678e390c1fb890.png",
    height: 48,
  },
  {
    id: 48,
    route: "lego-city-landmark",
    img: "https://file.302.ai/gpt/imgs/89c4e3c9e024a35f51d9a97c7d8b89e8.png",
    height: 48,
  },
  {
    id: 49,
    route: "word-and-graphic-fusion",
    img: "https://file.302.ai/gpt/imgs/428089d6a5c6dd496bf7f99577adf29b.png",
    height: 48,
  },
  {
    id: 50,
    route: "3d-chrome-badge",
    img: "https://file.302.ai/gpt/imgs/e876fa7ee4f8e912fa966b14965c76e7.png",
    height: 48,
  },
  {
    id: 51,
    route: "animal-landmark-selfie",
    img: "https://file.302.ai/gpt/imgs/996ff251f5522b0a69c05f5709a4688d.png",
    height: 48,
  },
  {
    id: 52,
    route: "custom-anime-figure",
    img: "https://file.302.ai/gpt/imgs/3a6486801f0f04e19f6ece74b9b9e806.png",
    height: 48,
  },
  {
    id: 53,
    route: "glass-effect",
    img: "https://file.302.ai/gpt/imgs/357c1ee1f223bee33657284fecab87cb.png",
    height: 48,
  },
  {
    id: 54,
    route: "rusty-iron-plate",
    img: "https://file.302.ai/gpt/imgs/1ea9c6aacae8e30f23a73bbf6c38bd79.png",
    height: 48,
  },
  {
    id: 55,
    route: "flowing-ink",
    img: "https://file.302.ai/gpt/imgs/deb138f637453aafe1a6a9171e1a05f6.png",
    height: 48,
  },
  {
    id: 56,
    route: "neon-graffiti",
    img: "https://file.302.ai/gpt/imgs/eb7c35d913cd86a1bef7a1a7afb1f301.png",
    height: 48,
  },
  {
    id: 57,
    route: "grab-machine",
    img: "https://file.302.ai/gpt/imgs/eef892f8bbd59d26cce31ad131168446.png",
    height: 48,
  },
  {
    id: 58,
    route: "creative-minimalist-ad",
    img: "https://file.302.ai/gpt/imgs/b81556f54a5817f3fd31f59ec0406327.png",
    height: 48,
  },
  {
    id: 59,
    route: "glass-fragment",
    img: "https://file.302.ai/gpt/imgs/0f4ec0bf125c50b4e8a7c898f21fa9a8.png",
    height: 48,
  },
  {
    id: 60,
    route: "creative-drawstring-bag",
    img: "https://file.302.ai/gpt/imgs/c5e7e84c7aa2a65917d4d91a4a59d027.png",
    height: 48,
  },
  {
    id: 61,
    route: "flower-sculpture",
    img: "https://file.302.ai/gpt/imgs/c4013471ca5851b8cd1d562cd0cfbdd2.png",
    height: 48,
  },
  {
    id: 62,
    route: "succulent-pot",
    img: "https://file.302.ai/gpt/imgs/a74e51d855a6824e98e9be757d532cb2.png",
    height: 48,
  },
  {
    id: 63,
    route: "retro-science-fiction-book-cover",
    img: "https://file.302.ai/gpt/imgs/308a9030e62b7c39c20685270a051db5.png",
    height: 48,
  },
  {
    id: 64,
    route: "coin",
    img: "https://file.302.ai/gpt/imgs/7d663b01624672d126f61a9965198d20.png",
    height: 48,
  },
  {
    id: 65,
    route: "emotion-cake",
    img: "https://file.302.ai/gpt/imgs/4712358883d02f0cd54ff66253c3228f.png",
    height: 48,
  },
  {
    id: 66,
    route: "balloon",
    img: "https://file.302.ai/gpt/imgs/a2c4b266f2612687816dad9fe9bed6a3.png",
    height: 48,
  },
  {
    id: 67,
    route: "monster-letter",
    img: "https://file.302.ai/gpt/imgs/561fce928e4e4d530a37c3a238f0a99f.png",
    height: 48,
  },
  {
    id: 68,
    route: "toy-box-city",
    img: "https://file.302.ai/gpt/imgs/f98028381abdebad65fa62f703347d98.png",
    height: 48,
  },
  {
    id: 69,
    route: "flat-lay-photo",
    img: "https://file.302.ai/gpt/imgs/20250828/25f6a5fd0c734d798d0f2b6d8f806967.png",
    height: 48,
  },
  {
    id: 70,
    route: "threeD-people",
    img: "https://file.302.ai/gpt/imgs/20250828/7a2a064590164d8b83e9ac83d90667be.png",
    height: 48,
  },
  {
    id: 70,
    route: "cartoon-to-real",
    img: "https://file.302.ai/gpt/imgs/20250828/7c4a8e37341b4b6a911f39cdd44d4317.png",
    height: 48,
  },
];

// Process examples based on region
const processExamples = (exampleList: typeof examples, region?: number) => {
  return exampleList.map((example) => {
    if (region === 0) {
      return {
        ...example,
        img: example.img.replace("file.302.ai", "file.302ai.cn"),
      };
    }
    return example;
  });
};

// 根据路由匹配对应的图片和高度信息
const getExampleByRoute = (route: string, region?: number) => {
  const processedExamples = processExamples(examples, region);
  return processedExamples.find((example) => example.route === route);
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const currentRoute = pathname.split("/").pop() || "";
  const { region } = store.get(appConfigAtom);
  const matchedExample = getExampleByRoute(currentRoute, region);
  const matchedImage = matchedExample?.img;
  const imageHeight = matchedExample?.height || 48; // Default to 48 if not specified

  return (
    <div className="relative flex h-full w-full">
      <Sidebar />
      <div className="h-full flex-1">
        <div className="absolute right-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">
                <HistoryIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <HistoryModal />
            </DialogContent>
          </Dialog>
        </div>
        {matchedImage && (
          <div className="flex justify-center">
            <div className="relative inline-block">
              <img
                src={matchedImage}
                alt="Preview"
                className={`h-${imageHeight} w-auto rounded-md`}
                style={{ maxWidth: "220px" }}
              />
            </div>
          </div>
        )}
        {children}
        <History />
      </div>
    </div>
  );
};

export default Layout;
