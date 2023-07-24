import type React from "react";
import { Logo } from "../../../Logo/Logo";
import { ThemeToggle } from "../../../ThemeToggle/ThemeToggle";

export function ReactiveNavPart(): React.ReactNode {
  return (
    <div className="flex w-full flex-wrap items-center justify-between px-3">
      <div
        className="!visible hidden flex-shrink basis-[100%] items-center lg:!flex lg:basis-auto"
        data-te-collapse-item
        id="navbarSupportedContent1"
      >
        <a
          className="mb-4 ml-2 mr-5 mt-3 flex items-center text-high-contrast lg:mb-0 lg:mt-0"
          href="/"
        >
          <Logo />
        </a>
      </div>

      <div className="relative flex items-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
