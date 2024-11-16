import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import { NavbarTitle } from "./Navbar";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export default function NavbarMobile() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenuOpen = useCallback(
    () => setMobileMenuOpen((open) => !open),
    []
  );

  if (isMobileMenuOpen) {
    return (
      <nav className="mx-2 flex flex-col gap-4 rounded-[25px] bg-black bg-opacity-80 p-6 backdrop-blur-2xl sm:max-h-300">
        <div
          className={[
            "flex flex-1 flex-grow items-center justify-between",
            "rounded-[50px] border border-stone-300 bg-opacity-10 p-4 backdrop-blur-2xl",
          ].join("")}
        >
          <div className="flex h-38 grow items-center justify-between gap-4">
            <NavbarTitle />
            <button
              type="button"
              aria-label="Menu"
              data-state="open"
              onClick={toggleMobileMenuOpen}
            >
              <Cross1Icon className="text-white" width="24" height="24" />
            </button>
          </div>
        </div>
        <div>
          <ul className="mx-2 flex flex-col gap-4">
            {/* <li className="flex">
              <NavbarLink
                href="https://github.com/coinbase/build-onchain-apps"
                target="_blank"
              >
                <GitHubLogoIcon width="24" height="24" />
              </NavbarLink>
            </li> */}
          </ul>
          <div className="mx-2 mt-4">{<DynamicWidget />}</div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={[
        "flex flex-1 flex-grow items-center justify-between",
        "rounded-[50px] border border-stone-300 bg-white bg-opacity-10 p-4 backdrop-blur-2xl",
        "mx-4",
      ].join("")}
    >
      <div className="flex h-8 grow items-center justify-between gap-4">
        <NavbarTitle />
        <button
          type="button"
          aria-label="Menu"
          data-state="closed"
          onClick={toggleMobileMenuOpen}
        >
          <HamburgerMenuIcon width="24" height="24" />
        </button>
      </div>
    </nav>
  );
}
