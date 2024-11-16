"use client";
import Header from "@/components/layout/header/Header";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import DaoOption, { DaoOptionType } from "./DaoOption";
import NextLink from "next/link";

/**
 * Use the page component to wrap the components
 * that you want to render on the page.
 */
export default function OnboardingFirstPage() {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDaos, setSelectedDaos] = useState<string[]>([]);

  // TODO: POPUP for gaining voting right

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [sdkHasLoaded, isLoggedIn, primaryWallet]);

  const DAOS_LIST: DaoOptionType[] = [
    {
      title: "Polygon DAO",
      iconUrl: "https://nouns.wtf/static/media/noggles.7644bfd0.svg",
      tags: ["Community", "Chain"],
      totalMembers: "139.5k",
    },
    {
      title: "Nouns DAO",
      iconUrl: "https://nouns.wtf/static/media/noggles.7644bfd0.svg",
      tags: ["Community", "Social Good"],
      totalMembers: "139.5k",
    },
    {
      title: "Celo DAO",
      iconUrl: "https://nouns.wtf/static/media/noggles.7644bfd0.svg",
      tags: ["Community", "Chain"],
      totalMembers: "139.5k",
    },
    {
      title: "Web3 for Good DAO",
      iconUrl: "https://nouns.wtf/static/media/noggles.7644bfd0.svg",
      tags: ["Community", "Chain"],
      totalMembers: "139.5k",
    },
  ];

  const toggleDaoSelection = (title: string) => {
    setSelectedDaos((prev) =>
      prev.includes(title)
        ? prev.filter((dao) => dao !== title)
        : [...prev, title]
    );
  };

  return (
    <>
      <Header />
      <main className="container mx-auto flex flex-col">
        <div className="w-full flex flex-col items-center justify-center">
          {!isLoading && primaryWallet && isEthereumWallet(primaryWallet) && (
            <div className="flex flex-row w-full h-[600px]">
              <div className="w-2/5 border border-black rounded-2xl p-16 bg-purple-400 bg-opacity-65">
                <h3 className="text-3xl text-white font-bold text-center mt-24">
                  Choose Your DAOs
                </h3>
                <p className="text-white mt-4 text-sm">
                  Select the communitites where you want AgentDao to vote on
                  your behalf, you can always change it later
                </p>
                <img className="mt-6" src={"/onboarding-1.svg"} />
              </div>
              <div className="flex flex-col w-full h-screen w-3/5 ml-4 bg-white rounded-2xl bg-opacity-55">
                <div className="flex h-1/5 justify-center items-center">
                  <div className="border border-black rounded-2xl">
                    <div className="flex flex-row">
                      <div className="avatar">
                        <div className="w-12 m-4 rounded-full">
                          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-start mr-4">
                        <h1 className="font-bold text-lg">
                          Your voting agent is not active
                        </h1>
                        <p className="text-xs">
                          Proceed with the steps to activate your personal
                          voting AI agent
                        </p>
                      </div>
                      <div className="flex justify-center items-center mr-4 pb-4">
                        <input type="checkbox" className="toggle" disabled />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-2/5 justify-start items-start ml-12">
                  <h2 className="text-xl font-bold mb-2">Select your DAOs</h2>
                  <p className="text-xs text-gray-700">
                    Pick the communities you want your AI Agent to engage in
                  </p>
                  <div className="flex flex-row mt-4 flex-wrap gap-6">
                    {DAOS_LIST.map((dao: DaoOptionType) => (
                      <DaoOption
                        key={dao.title}
                        iconUrl={dao.iconUrl}
                        title={dao.title}
                        tags={dao.tags}
                        totalMembers={dao.totalMembers}
                        isSelected={selectedDaos.includes(dao.title)}
                        onSelect={toggleDaoSelection}
                      />
                    ))}
                  </div>
                  <div className="flex flex-row-reverse mt-8 pr-8 w-full">
                    <NextLink href="/onboarding/4">
                      <button
                        className="btn btn-outline btn-lg rounded-full p-4 text-black"
                        disabled={selectedDaos.length === 0}
                      >
                        Proceed
                      </button>
                    </NextLink>
                  </div>
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
