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
              <div className="flex flex-col w-full h-screen ml-4 bg-white rounded-2xl bg-opacity-55">
                <div className="flex h-1/5 justify-center items-center">
                  <div className="border border-black rounded-2xl">
                    <div className="flex flex-row">
                      <div className="avatar">
                        <div className="w-12 m-4 rounded-full">
                          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTFkN2Q1IiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMTAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIyMCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjMwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNDAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjUwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjUwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI2MCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI2MCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNzAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIyNzAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjgwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjgwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI5MCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI5MCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIzMDAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIzMDAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMzEwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMzEwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIyNDAiIGZpbGw9IiNjZWMxODkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjI0MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjQwIiBmaWxsPSIjY2VjMTg5IiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyNDAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjI1MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMjUwIiBmaWxsPSIjY2VjMTg5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyNTAiIGZpbGw9IiM3NDU4MGQiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjI1MCIgZmlsbD0iI2NlYzE4OSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjUwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIyNjAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI2MCIgZmlsbD0iI2NlYzE4OSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjYwIiBmaWxsPSIjNzQ1ODBkIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyNjAiIGZpbGw9IiNjZWMxODkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjI2MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMjcwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyNzAiIGZpbGw9IiNjZWMxODkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjI3MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iMjcwIiBmaWxsPSIjY2VjMTg5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyODAiIGZpbGw9IiM2M2EwZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI4MCIgZmlsbD0iIzYzYTBmOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjgwIiBmaWxsPSIjNjNhMGY5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyOTAiIGZpbGw9IiM2M2EwZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjMwMCIgZmlsbD0iIzYzYTBmOSIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iNzAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjgwIiBmaWxsPSIjYjkyYjNjIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSI5MCIgZmlsbD0iI2I5MmIzYyIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTAwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMDAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjEwMCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTEwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMTAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjExMCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTIwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMjAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjEyMCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTMwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxMzAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjEzMCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTQwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNDAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE0MCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTQwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjUwIiB5PSIxNTAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE1MCIgZmlsbD0iI2I5MmIzYyIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTUwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjE1MCIgZmlsbD0iIzY2N2FmOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI1MCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjUwIiB5PSIxNjAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE2MCIgZmlsbD0iI2I5MmIzYyIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTYwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE3MCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTcwIiBmaWxsPSIjYjkyYjNjIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNzAiIGZpbGw9IiM4MDdmN2UiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE3MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTgwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxODAiIGZpbGw9IiNiOTJiM2MiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE4MCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTgwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjEwIiB5PSIxODAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNTAiIHk9IjE4MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTkwIiBmaWxsPSIjODA3ZjdlIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxOTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIzMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjIwMCIgZmlsbD0iIzgwN2Y3ZSIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTEwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxMTAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjEyMCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTIwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxMjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjEyMCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTIwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxMjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjEyMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTIwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjEzMCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTMwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxMzAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjEzMCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTMwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxMzAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjEzMCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxNDAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE0MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTQwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxNDAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE0MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTQwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE0MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTQwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjE1MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTUwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjE1MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTUwIiBmaWxsPSIjZDE5YTU0IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNTAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE1MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxNTAiIGZpbGw9IiNkMTlhNTQiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE2MCIgZmlsbD0iI2QxOWE1NCIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTYwIiBmaWxsPSIjZDE5YTU0IiAvPjwvc3ZnPg==" />
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
