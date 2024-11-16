"use client";
import Header from "@/components/layout/header/Header";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { UpdateIcon } from "@radix-ui/react-icons";

export default function VotingPage() {
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
      <main className="container mx-auto flex">
        <div className="w-full flex items-center justify-center">
          {!isLoading && primaryWallet && isEthereumWallet(primaryWallet) && (
            <div className="flex flex-row">
              <div className="border border-black rounded-2xl p-16 bg-purple-400 bg-opacity-65">
                <UpdateIcon className="relative left-1/3 top-12 text-white h-16 w-16 animate-spin" />

                <h3 className="text-3xl text-white font-bold text-center mt-24">
                  Placing your votes
                </h3>
              </div>
            </div>
          )}
          {isLoading && <DynamicWidget />}
        </div>
      </main>
    </>
  );
}
