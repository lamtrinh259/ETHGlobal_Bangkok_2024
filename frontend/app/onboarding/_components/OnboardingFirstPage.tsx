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
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

/**
 * Use the page component to wrap the components
 * that you want to render on the page.
 */
export default function OnboardingFirstPage() {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDaos, setSelectedDaos] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState("Processing Airdrop");
  const [modalText, setModalText] = useState(
    "Please wait while we airdrop your voting tokens..."
  );

  const openModal = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    if (modal) modal.close();
  };

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      let privateKey: `0x${string}` | null = localStorage.getItem(
        primaryWallet?.address || ""
      ) as `0x${string}` | null;
      if (!privateKey) {
        privateKey = generatePrivateKey();
        localStorage.setItem(primaryWallet?.address, privateKey);

        const wallet = privateKeyToAccount(privateKey);

        const generateWalletAndAirdrop = async () => {
          openModal();
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/airdrop`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  walletAddress: wallet.address,
                  signature: "0x",
                }),
              }
            );

            const data = await response.json();
            if (data.success) {
              setModalTitle("Airdrop successful!");
              setModalText(`ethTx: ${data.ethTxHash}`);
              console.log("Airdrop successful!", {
                tokenTx: data.tokenTxHash,
                ethTx: data.ethTxHash,
              });
            }
          } catch (error) {
            console.error("Airdrop failed:", error);
          } finally {
            closeModal();
          }
        };

        generateWalletAndAirdrop();
      }
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
                          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTFkN2Q1IiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMTAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIyMCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjMwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjUwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjUwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI2MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI2MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIyNzAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjgwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjgwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI5MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI5MCIgZmlsbD0iIzA2ODk0MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIzMDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIzMDAiIGZpbGw9IiMwNjg5NDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMzEwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMzEwIiBmaWxsPSIjMDY4OTQwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyMzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIzMCIgZmlsbD0iIzhiYzBjNSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjQwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyNDAiIGZpbGw9IiM4YmMwYzUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjI1MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMjUwIiBmaWxsPSIjOGJjMGM1IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyNjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI2MCIgZmlsbD0iIzhiYzBjNSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjYwIiBmaWxsPSIjOGJjMGM1IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyNzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjI3MCIgZmlsbD0iIzhiYzBjNSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjgwIiBmaWxsPSIjOGJjMGM1IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyOTAiIGZpbGw9IiM4YmMwYzUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIzMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iNDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjUwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSI2MCIgZmlsbD0iI2I5MmIzYyIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iNzAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iODAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjgwIiBmaWxsPSIjYjkyYjNjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSI4MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iODAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjgwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTkwIiB5PSI4MCIgZmlsbD0iI2I5MmIzYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIxMCIgeT0iODAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjkwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxMDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjExMCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTIwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxMzAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE0MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTUwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNjAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE3MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxODAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE4MCIgZmlsbD0iI2I5MmIzYyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTgwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxODAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE4MCIgZmlsbD0iI2YzMzIyYyIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxOTAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjE5MCIgZmlsbD0iI2I5MmIzYyIgLz48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMTkwIiBmaWxsPSIjZjMzMjJjIiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIyMDAiIGZpbGw9IiNmMzMyMmMiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjExMCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTEwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxMjAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjEyMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTIwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMjAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjEyMCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTIwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxMjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjEyMCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxMzAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjEzMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTMwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMzAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjEzMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTMwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxMzAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTQwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxNDAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE0MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTQwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNDAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE0MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTQwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNDAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjE0MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxNTAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE1MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxNTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE1MCIgZmlsbD0iI2ZmZWYxNiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTUwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE1MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTUwIiBmaWxsPSIjZmZlZjE2IiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxNjAiIGZpbGw9IiNmZmVmMTYiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE2MCIgZmlsbD0iI2ZmZWYxNiIgLz48L3N2Zz4=" />
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
                    <NextLink href="/onboarding/2">
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
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box flex flex-col items-center">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">{modalTitle}</h3>
            <p className="py-4">{modalText}</p>
            <div className="loader mt-4"></div>
          </div>
        </dialog>
      </main>
    </>
  );
}
