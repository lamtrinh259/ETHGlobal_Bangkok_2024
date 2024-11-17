// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import NextLink from "next/link";
import { DynamicWidget } from "@/lib/dynamic";
import { HomeIcon, SquareIcon } from "@radix-ui/react-icons";

export function NavbarLink({
  href,
  children,
  target,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
  ariaLabel?: string;
}) {
  return (
    <NextLink
      href={href}
      className="px-0 text-center font-normal font-robotoMono text-base text-white no-underline"
      target={target}
      aria-label={ariaLabel}
    >
      {children}
    </NextLink>
  );
}

export function NavbarTitle() {
  return (
    <div className="flex h-8 items-center justify-start gap-4">
      <NextLink
        href="/"
        passHref={true}
        className="relative h-8 w-8"
        aria-label="Home page"
      >
        <div className="absolute size-8 rounded-full bg-purple-300"></div>
      </NextLink>
      <NextLink
        href="/"
        passHref={true}
        className="text-center font-medium font-robotoMono text-white text-xl no-underline"
        aria-label="build-onchain-apps Github repository"
      >
        Votr
      </NextLink>
    </div>
  );
}

function Navbar() {
  return (
    <nav
      className={clsx(
        "flex flex-1 flex-grow items-center justify-between",
        "rounded-[50px] border border-stone-300 bg-black bg-opacity-90 p-4 backdrop-blur-2xl"
      )}
    >
      <div className="flex h-8 grow items-center justify-between gap-4">
        <NavbarTitle />
        <div className="flex items-center justify-start gap-8">
          <ul className="hidden items-center justify-start gap-8 md:flex">
            <li className="flex hover:opacity-50">
              <NavbarLink href="/dashboard">
                <HomeIcon
                  width="24"
                  height="24"
                  aria-label="build-onchain-apps Github respository"
                />
              </NavbarLink>
            </li>
            <li className="flex hover:opacity-50">
              <NavbarLink href="/history">
                <SquareIcon
                  width="24"
                  height="24"
                  aria-label="build-onchain-apps Github respository"
                />
              </NavbarLink>
            </li>
            <li className="flex">
              <DynamicWidget />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
