import { generateMetadata } from "@/utils/generateMetadata";
import OnboardingThirdPage from "../_components/OnboardingThirdPage";

export const metadata = generateMetadata({
  title: "Onboarding",
  description: "Onboard to AgentDao",
  images: "themes.png",
  pathname: "",
});

/**
 * Server component, which imports the Home component (client component that has 'use client' in it)
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 * https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration#step-4-migrating-pages
 * https://nextjs.org/docs/app/building-your-application/rendering/client-components
 */
export default function Page() {
  return (
    <div className="h-screen inset-0 -z-10 w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_2000px_at_50%_400px,#d5c5ff,transparent)]">
        <OnboardingThirdPage />
      </div>
    </div>
  );
}