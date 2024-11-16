"use client";
import Header from "@/components/layout/header/Header";
import NextLink from "next/link";

/**
 * Use the page component to wrap the components
 * that you want to render on the page.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto flex flex-col">
        <div className="w-full flex flex-col items-center justify-center h-screen">
          <h2 className="mb-10 text-center font-medium text-black text-2xl md:text-4xl lg:text-6xl">
            Empower Your Voice in DAOs with Intelligent Voting
          </h2>
          <p className="text-lg">
            Your personalized voting agent that ensures your values and
            preferences are reflected accurately in governance
          </p>
          <NextLink href="/onboarding/1">
            <button className="btn btn-secondary btn-lg text-xl mt-8">
              Get started
            </button>
          </NextLink>
        </div>
      </main>
    </>
  );
}
