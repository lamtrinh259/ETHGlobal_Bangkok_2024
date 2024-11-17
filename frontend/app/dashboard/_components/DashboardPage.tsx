"use client";
import Header from "@/components/layout/header/Header";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import DaoOption, {
  DaoOptionType,
} from "../../onboarding/_components/DaoOption";
import NextLink from "next/link";

/**
 * Use the page component to wrap the components
 * that you want to render on the page.
 */
export default function DashboardPage() {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDaos, setSelectedDaos] = useState<string[]>([]);

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      let privateKey: `0x${string}` | null = localStorage.getItem(
        primaryWallet?.address || ""
      ) as `0x${string}` | null;
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
      title: "CharityDAO",
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
                          Your voting agent is active
                        </h1>
                        <p className="text-xs">
                          You autonimous agent is actively voting on your behalf
                        </p>
                      </div>
                      <div className="flex flex-col justify-center items-center mr-4 mt-4 pb-4 gay-4">
                        <div className="flex flex-row justify-center items-center">
                          <p className="text-sm mr-2">Auto Mode</p>
                          <input
                            type="checkbox"
                            className="toggle toggle-success"
                            defaultChecked
                          />
                        </div>
                        <button className="text-xs btn btn-outline btn-sm rounded-3xl mt-6">
                          Change Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-2/5 justify-start items-center ml-12">
                  <h2 className="text-xl font-bold mb-2">Your DAOs</h2>
                  <p className="text-xs text-gray-700">
                    Pick the communities you want your AI Agent to engage in
                  </p>
                  <div className="flex flex-row mt-4 flex-wrap gap-6">
                    {DAOS_LIST.map((dao: DaoOptionType, idx: number) => (
                      <DaoOption
                        key={dao.title}
                        iconUrl={dao.iconUrl}
                        title={dao.title}
                        tags={dao.tags}
                        totalMembers={dao.totalMembers}
                        isSelected={
                          idx % 2 == 1 || selectedDaos.includes(dao.title)
                        }
                        onSelect={toggleDaoSelection}
                      />
                    ))}
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
