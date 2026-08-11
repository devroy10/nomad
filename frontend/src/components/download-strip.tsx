import Image from "next/image";
import { ChevronDown } from "@/components/ui/icons";
import { CornerDots } from "@/components/ui/corner-dots";

/**
 * The download/showcase strip: three down chevrons, the hero showcase
 * image (theme-aware), and a dashed spacer.
 */
export function DownloadStrip() {
  return (
    <div className="containers isolate flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col border-x border-border">
        <div className="isolate">
          <div className="border-dashed-spaced-y">
            <div className="relative mx-auto flex max-w-[1160px] gap-2 border-border py-3 pl-4 tablet:py-[17px] tablet:pl-[29px] desktop:border-x">
              <ChevronDown className="size-5 tablet:size-6" />
              <ChevronDown className="size-5 tablet:size-6" />
              <ChevronDown className="size-5 tablet:size-6" />
              <div className="bg-border absolute left-0 right-0 top-0 z-20 h-px" />
              <div className="bg-border absolute bottom-0 left-0 right-0 z-20 h-px" />
              <CornerDots />
            </div>
          </div>
          <div className="border-dashed-b">
            <div className="relative mx-auto max-w-[1160px] aspect-1160/650 border-x border-border">
              <Image
                alt="showcase"
                fill
                sizes="1160px"
                priority
                unoptimized
                className="object-cover dark:hidden"
                src="/media/hero-light.webp"
              />
              <Image
                alt="showcase"
                fill
                sizes="1160px"
                priority
                unoptimized
                className="hidden object-cover dark:block"
                src="/media/hero-dark.webp"
              />
              <div className="bg-border absolute bottom-0 left-0 right-0 z-10 h-px" />
              <div className="bg-border-point absolute bottom-0 left-0 z-20 size-1 -translate-x-1/2 translate-y-1/2" />
              <div className="bg-border-point absolute bottom-0 right-0 z-20 size-1 translate-x-1/2 translate-y-1/2" />
            </div>
          </div>
          <div className="border-dashed-b">
            <div className="border-dashed-l border-dashed-r mx-auto h-16 max-w-[1160px] tablet:h-20 desktop:h-30" />
          </div>
        </div>
      </div>
    </div>
  );
}
