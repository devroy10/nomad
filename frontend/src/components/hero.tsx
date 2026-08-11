import Image from "next/image";
import { DownloadButton } from "@/components/navbar";
import { ChevronDownDouble } from "@/components/ui/icons";
import { NomadNetwork } from "@/components/nomad-network";

export function Hero() {
  return (
    <div className="flex flex-col gap-10 desktop:flex-row desktop:gap-[58px]">
      {/* Left column */}
      <div className="flex max-w-[753px] flex-col justify-center px-6 pb-10 pt-6 tablet:px-20 tablet:pb-0 tablet:pt-10 desktop:pl-[116px] desktop:pr-0 desktop:pt-0">
        <div className="flex gap-1  text-[14px] font-medium leading-[14px] tracking-[0.72px] text-[#3BBDB2] text-accent-primary">
          <span>[ Deployed on </span>
          <span className="inline-flex items-center">
            <Image
              className="inline"
              src="/media/Zerops-dark.svg"
              alt="Zerops"
              width={14}
              height={14}
            />
          </span>
          <span> Zerops ]</span>
        </div>
        <h1 className="-tracking-[0.03em] mt-3 mb-4 font-medium text-balance text-text-primary text-[32px] leading-[38px] tablet:text-[40px] tablet:leading-[48px] desktop:text-[54px] desktop:leading-[60px]">
          The Agentic SRE for Zerops Cloud deployments.
        </h1>
        <p className=" max-w-[504px] -tracking-[0.03em] text-[14px] leading-[20px] text-text-tertiary/80 tablet:text-[16px] tablet:leading-[22px] desktop:text-[18px] desktop:leading-[24px]">
          Watch a live Zerops deployment, catch every anomaly, and let the
          agent apply the fix.
        </p>
        <p className="mt-4 max-w-[504px]  text-[13px] leading-[20px] -tracking-[0.03em] text-text-secondary tablet:text-[14px] tablet:leading-[22px]">
          Break a service, watch it heal. Real log forwarding, real API, no
          fake webhooks.
        </p>
        <div className="mt-8 mb-1.5">
          <DownloadButton />
        </div>
        <div className=" text-[14px] leading-[24px] -tracking-[0.03em] text-text-tertiary/80">
          [
          <ChevronDownDouble className="text-accent-primary mr-1 inline" />
          Open source
          <span className="text-accent-primary"> · MIT </span>license]
        </div>
      </div>

      {/* Right column - animated platform art */}
      <div className="hidden flex-1 shrink-0 items-center desktop:min-w-[450px] desktop:border-l desktop:border-border tablet:flex">
        <div className="border-dashed-spaced-y bg-surface-1 relative flex-1">
          <NomadNetwork />
        </div>
      </div>
    </div>
  );
}
