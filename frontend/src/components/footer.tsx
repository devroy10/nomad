import { Wordmark } from "@/components/ui/wordmark";
import { FooterThemeToggle } from "@/components/footer-theme-toggle";

export function Footer() {
  return (
    <div className="border-y border-border">
      <div className="containers isolate flex flex-1 flex-col">
        <div className="flex w-full flex-1 flex-col">
          <div className="isolate">
            <div className="mx-auto flex w-full max-w-[1160px] flex-col border-x border-border bg-surface-1 p-7">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className=" -tracking-[0.03em] text-[14px] leading-[1.3] text-text-tertiary">
                    Nomad © 2026
                  </div>
                  <Wordmark className="w-[113px] text-text-primary" />
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <FooterThemeToggle />
                <div className="flex items-center gap-2">
                  <a target="_blank" rel="noopener noreferrer" href="https://github.com/devroy10/nomad">
                    <GithubIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6">
      <path
        d="M16.2803 8.04566C16.7241 7.1594 16.2169 6 16.2169 6C15.0758 6 14.2513 6.81809 14.2513 6.81809C13.8076 6.5454 12.3491 6.5454 12.3491 6.5454C12.3491 6.5454 10.8907 6.5454 10.4469 6.81809C10.4469 6.81809 9.62282 6 8.48134 6C8.48134 6 7.97419 7.15897 8.41795 8.04566C8.41795 8.04566 7.40365 9.06828 7.78401 11.2503C8.14165 13.3007 9.813 13.8414 10.8907 13.8414C10.8907 13.8414 10.4469 14.2504 10.5103 14.9321C10.5103 14.9321 9.87639 15.3412 9.24246 15.0685C8.60853 14.7958 8.29156 14.1141 8.29156 14.1141C8.29156 14.1141 7.65762 13.2278 7.02369 13.5687C7.02369 13.5687 6.83351 13.7732 7.53084 14.1141C7.53084 14.1141 8.03798 14.9321 8.22816 15.4094C8.41835 15.8866 9.43264 16.2956 10.4473 16.0229V17.591C10.4473 17.591 10.4473 17.7273 10.1938 17.7955C9.94019 17.8637 9.94019 18 10.067 18H14.6321C14.7589 18 14.7589 17.8637 14.5053 17.7955C14.2517 17.7273 14.2517 17.591 14.2517 17.591V16.0229C14.2517 16.0229 14.2573 15.2053 14.2517 14.9321C14.2378 14.247 13.808 13.8414 13.808 13.8414C14.8857 13.8414 16.557 13.3007 16.9147 11.2503C17.295 9.06828 16.2807 8.04566 16.2807 8.04566H16.2803Z"
        fill="currentColor"
      />
    </svg>
  );
}
