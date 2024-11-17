"use client";
import Header from "@/components/layout/header/Header";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import NextLink from "next/link";

/**
 * Use the page component to wrap the components
 * that you want to render on the page.
 */
export default function OnboardingSecondPage() {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [sdkHasLoaded, isLoggedIn, primaryWallet]);

  return (
    <>
      <Header />
      <main className="container mx-auto flex flex-col">
        <div className="w-full flex flex-col items-center justify-center">
          {!isLoading && primaryWallet && isEthereumWallet(primaryWallet) && (
            <div className="flex flex-row w-full h-[600px]">
              <div className="w-2/5 border border-black rounded-2xl p-16 bg-purple-400 bg-opacity-65">
                <h3 className="text-3xl text-white font-bold text-center mt-24">
                  Connect Your X & Curate Your Profile
                </h3>
                <p className="text-white mt-4 text-sm">
                  Let Votr understand your interests and activity to help tailor
                  your voting preferences across DAOs
                </p>
                <img className="mt-6" src={"/onboarding-2.svg"} />
              </div>
              <div className="flex flex-col w-full h-screen w-3/5 ml-4 bg-white rounded-2xl bg-opacity-55">
                <div className="flex h-1/5 justify-center items-center">
                  <div className="border border-black rounded-full w-1/2 hover:bg-black hover:bg-opacity-35">
                    <div className="flex flex-row justify-center">
                      <div className="avatar">
                        <div className="w-12 m-4 rounded-full">
                          <img
                            className="w-6 h-6"
                            src="https://i.pinimg.com/originals/8e/72/f7/8e72f7331b652b842b0c271ab144d332.png"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center mr-4">
                        <h1 className="font-bold text-lg">Connect X</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-2/5 justify-start items-center ml-12">
                  <NextLink href="/onboarding/4">
                    <h2 className="text-xl font-bold mb-2">Skip for now</h2>
                  </NextLink>
                </div>
              </div>
            </div>
          )}
          {isLoading && <DynamicWidget />}
        </div>
      </main>
    </>
  );
}
