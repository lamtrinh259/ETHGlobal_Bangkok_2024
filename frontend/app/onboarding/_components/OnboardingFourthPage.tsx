"use client";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { fetchQuestions, Question } from "@/api/questionService";
import { Proposal } from "@/api/proposalService";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import Header from "@/components/layout/header/Header";
import NextLink from "next/link";

export default function OnboardingFourthPage() {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [proposals, setProposals] = useState<Proposal[] | null>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const router = useRouter();
  const [modalTitle, setModalTitle] = useState("Learning your ways");
  const [modalText, setModalText] = useState(
    "Please wait while we understand you at a deeper level..."
  );

  const openModal = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
    if (modal) modal.close();
  };

  const selectedDaos = ["charitydao"];

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      const privateKey: `0x${string}` | null = localStorage.getItem(
        primaryWallet?.address || ""
      ) as `0x${string}` | null;
      if (!privateKey) {
        router.replace("/boarding/1");
      }
      setIsLoading(false);
      fetchQuestions(selectedDaos).then((data) => {
        setQuestions(data.questions);
        setChatHistory([data.questions[0]?.text || ""]);
      });
    } else {
      setIsLoading(true);
    }
  }, [sdkHasLoaded, isLoggedIn, primaryWallet]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    setChatHistory((prev) => [...prev, `User: ${userInput}`]);
    setUserInput("");
    setIsAgentTyping(true);

    const randomDelay = Math.floor(Math.random() * (1000 - 500 + 1)) + 1000;

    setTimeout(() => {
      const nextQuestion = questions[currentQuestionIndex + 1];

      // Add the next question to chatHistory or a final message if questions are done
      if (nextQuestion) {
        setChatHistory((prev) => [...prev, nextQuestion.text]);
      } else {
        setChatHistory((prev) => [...prev, "Thank you for your responses!"]);
        sendChatHistory(); // Send chat history to the backend when questions are completed
      }

      // Update typing state and question index
      setIsAgentTyping(false);
      setCurrentQuestionIndex((prev) => prev + 1);
    }, randomDelay);
  };

  const voteDaoAbi = [
    "function vote(uint256 proposalId, uint8 voteType) external",
  ];

  const castVotes = async (proposals?: Proposal[]) => {
    setModalTitle("Casting your votes");
    setModalText("Please wait while we cast your votes...");
    try {
      const privateKey = localStorage.getItem(
        primaryWallet?.address ?? ""
      ) as string;
      if (!privateKey) {
        console.error("No private key found");
        return;
      }

      const provider = new ethers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
      const signer = new ethers.Wallet(privateKey, provider);

      const voteDaoAddress = "0x4607bccaC7A2E21e6CAc8D9D12dff961F21eB17f";
      const contract = new ethers.Contract(voteDaoAddress, voteDaoAbi, signer);

      const tx = await contract.vote(0, 0); // proposalId = 0, voteType = 0
      await tx.wait();

      console.log("Vote transaction successful:", tx.hash);
      setModalTitle("Votes casted");
      setModalText(`Vote transaction successful: ${tx.hash}`);
    } catch (error) {
      console.error("Error sending vote:", error);
      setModalTitle("Failed to cast votes");
      setModalText(`Something went wrong, please contact us`);
    }
  };

  const sendChatHistory = async () => {
    openModal();
    try {
      // Transform chatHistory into the desired format
      const formattedChatHistory = chatHistory.map((entry) => {
        if (entry.startsWith("User:")) {
          return { role: "user", content: entry.replace("User:", "").trim() };
        } else {
          return { role: "assistant", content: entry.trim() };
        }
      });

      const payload = {
        chatHistory: formattedChatHistory,
        selectedDaos, // Assuming `selectedDaos` is already defined
      };

      console.log("Payload to be sent:", payload);

      // Make the API call with the transformed chatHistory
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/proposals`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("results", result);
      setProposals(result);
      // todo: pop up indicating vote is happening
      castVotes(result.proposals);

      console.log("API Response:", result);
    } catch (error) {
      console.error("Error sending chat history:", error);
    }
  };

  // const sendChatHistory = async () => {
  //   try {
  //     const data = await fetchProposals(chatHistory, selectedDaos);
  //     setProposals(data.proposals);
  //     // todo: pop up indicating vote is happening
  //     castVotes(data.proposals);
  //   } catch (error) {
  //     console.error("Error sending chat history:", error);
  //   }
  // };

  return (
    <>
      <Header />
      <main className="container mx-auto flex flex-col h-screen">
        <div className="w-full flex flex-col items-center justify-center h-2/3">
          {!isLoading && primaryWallet && isEthereumWallet(primaryWallet) && (
            <div className="flex flex-row w-full h-full">
              {/* Left Section */}
              <div className="w-2/5 border border-black rounded-2xl p-16 bg-purple-400 bg-opacity-65">
                <h3 className="text-3xl text-white font-bold text-center mt-24">
                  Shape your voting choice
                </h3>
                <p className="text-white mt-4 text-sm">
                  Chat with us to tailor the agent to vote the way you would.
                </p>
                <img className="mt-6" src={"/onboarding-3.svg"} />
              </div>
              {/* Chat Section */}
              <div className="flex flex-col w-3/5 ml-4 pr-12 bg-white rounded-2xl bg-opacity-55 h-full">
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  {chatHistory.map((message, index) => {
                    const isUserMessage = message.startsWith("User:");
                    return (
                      <div
                        key={index}
                        className={`chat ${
                          isUserMessage ? "chat-end" : "chat-start"
                        }`}
                      >
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt="Avatar"
                              src={
                                isUserMessage
                                  ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDVkN2UxIiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMTAiIGZpbGw9IiMzNGFjODAiIC8+PHJlY3Qgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIyMCIgZmlsbD0iIzM0YWM4MCIgLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjMwIiBmaWxsPSIjMzRhYzgwIiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNDAiIGZpbGw9IiMzNGFjODAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjUwIiBmaWxsPSIjMzRhYzgwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjUwIiBmaWxsPSIjMzRhYzgwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI2MCIgZmlsbD0iIzM0YWM4MCIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI2MCIgZmlsbD0iIzM0YWM4MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNzAiIGZpbGw9IiMzNGFjODAiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIyNzAiIGZpbGw9IiMzNGFjODAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjgwIiBmaWxsPSIjMzRhYzgwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjgwIiBmaWxsPSIjMzRhYzgwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI5MCIgZmlsbD0iIzM0YWM4MCIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI5MCIgZmlsbD0iIzM0YWM4MCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIzMDAiIGZpbGw9IiMzNGFjODAiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIzMDAiIGZpbGw9IiMzNGFjODAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMzEwIiBmaWxsPSIjMzRhYzgwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMzEwIiBmaWxsPSIjMzRhYzgwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyMzAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIzMCIgZmlsbD0iI2I4N2IxMSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjMwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyMzAiIGZpbGw9IiNiODdiMTEiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjIzMCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjQwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyNDAiIGZpbGw9IiNiODdiMTEiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI0MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjQwIiBmaWxsPSIjYjg3YjExIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIyNDAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjI1MCIgZmlsbD0iI2UxMTgzMyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjYwIiBmaWxsPSIjZTExODMzIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyNjAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjI2MCIgZmlsbD0iI2UxMTgzMyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjcwIiBmaWxsPSIjZTExODMzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyNzAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjI3MCIgZmlsbD0iI2UxMTgzMyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjgwIiBmaWxsPSIjZTExODMzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyODAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI4MCIgZmlsbD0iI2UxMTgzMyIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjkwIiBmaWxsPSIjZTExODMzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjMwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIzMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSI0MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iNDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iNTAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iNTAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iNTAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjUwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSI1MCIgZmlsbD0iI2NhZWZmOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIzMCIgeT0iNTAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iNjAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iNjAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjYwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSI2MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iNjAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjYwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjcwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjcwIiBmaWxsPSIjY2FlZmY5IiAvPjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSI3MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iNzAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjcwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjgwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjgwIiBmaWxsPSIjY2FlZmY5IiAvPjxyZWN0IHdpZHRoPSI5MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSI4MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iODAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjgwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjkwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjkwIiBmaWxsPSIjY2FlZmY5IiAvPjxyZWN0IHdpZHRoPSIxMzAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSI5MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iOTAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjkwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxNzAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxMDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjExMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTIwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxMzAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjE0MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTUwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSIxNjAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTcwIiBmaWxsPSIjN2NjNGYyIiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNzAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjE3MCIgZmlsbD0iI2ZhNmZlMiIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTcwIiBmaWxsPSIjY2FlZmY5IiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxNzAiIGZpbGw9IiM3Y2M0ZjIiIC8+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTgwIiBmaWxsPSIjY2FlZmY5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIxODAiIGZpbGw9IiM1YTZiN2IiIC8+PHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE4MCIgZmlsbD0iI2NhZWZmOSIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIxOTAiIGZpbGw9IiM3Y2M0ZjIiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE5MCIgZmlsbD0iI2NhZWZmOSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMTkwIiBmaWxsPSIjNWE2YjdiIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxOTAiIGZpbGw9IiNjYWVmZjkiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjE5MCIgZmlsbD0iIzdjYzRmMiIgLz48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMjAwIiBmaWxsPSIjY2FlZmY5IiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxMTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjExMCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTIwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxMjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjEyMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTIwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxMjAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjEyMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTIwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxMjAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTMwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxMzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjEzMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTMwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxMzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjEzMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTMwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjE0MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTQwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjE0MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTQwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNDAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE0MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTQwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxNDAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTUwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxNTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE1MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE1MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjE1MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTYwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNjAiIGZpbGw9IiNlYzViNDMiIC8+PC9zdmc+"
                                  : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDVkN2UxIiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMTAiIGZpbGw9IiNmOThmMzAiIC8+PHJlY3Qgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIyMCIgZmlsbD0iI2Y5OGYzMCIgLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjMwIiBmaWxsPSIjZjk4ZjMwIiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNDAiIGZpbGw9IiNmOThmMzAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjUwIiBmaWxsPSIjZjk4ZjMwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjUwIiBmaWxsPSIjZjk4ZjMwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI2MCIgZmlsbD0iI2Y5OGYzMCIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI2MCIgZmlsbD0iI2Y5OGYzMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNzAiIGZpbGw9IiNmOThmMzAiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIyNzAiIGZpbGw9IiNmOThmMzAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjgwIiBmaWxsPSIjZjk4ZjMwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjgwIiBmaWxsPSIjZjk4ZjMwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI5MCIgZmlsbD0iI2Y5OGYzMCIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI5MCIgZmlsbD0iI2Y5OGYzMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIzMDAiIGZpbGw9IiNmOThmMzAiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIzMDAiIGZpbGw9IiNmOThmMzAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMzEwIiBmaWxsPSIjZjk4ZjMwIiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMzEwIiBmaWxsPSIjZjk4ZjMwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIyMTAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjIxMCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE0MCIgeT0iMjIwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIyMjAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIzMCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjMwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyNDAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI1MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMjYwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyNzAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjI4MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjgwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIyODAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI5MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iNzAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iODAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjgwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjUwIiB5PSI4MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjUwIiB5PSI5MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSI5MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjgwIiB5PSI5MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iOTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyNTAiIHk9IjkwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjEwMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIxMDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTAwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjEwMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxMDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxMDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNjAiIHk9IjEwMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjUwIiB5PSIxMTAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTEwIiBmaWxsPSIjZDZjM2JlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxMTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjExMCIgZmlsbD0iI2Q2YzNiZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTEwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxMTAiIGZpbGw9IiNkNmMzYmUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjExMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjIxMCIgeT0iMTEwIiBmaWxsPSIjZDZjM2JlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjYwIiB5PSIxMTAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTIwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjEyMCIgZmlsbD0iI2Q2YzNiZSIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTIwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxMjAiIGZpbGw9IiNkNmMzYmUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjEyMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTIwIiBmaWxsPSIjZDZjM2JlIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTkwIiB5PSIxMjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjEyMCIgZmlsbD0iI2Q2YzNiZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI2MCIgeT0iMTIwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjEzMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIxMzAiIGZpbGw9IiNkNmMzYmUiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjEzMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTMwIiBmaWxsPSIjZDZjM2JlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIxMzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjEzMCIgZmlsbD0iI2Q2YzNiZSIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE5MCIgeT0iMTMwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxMzAiIGZpbGw9IiNkNmMzYmUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNjAiIHk9IjEzMCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjUwIiB5PSIxNDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTQwIiBmaWxsPSIjZDZjM2JlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjE0MCIgZmlsbD0iI2Q2YzNiZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTQwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNDAiIGZpbGw9IiNkNmMzYmUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE0MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjIxMCIgeT0iMTQwIiBmaWxsPSIjZDZjM2JlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjYwIiB5PSIxNDAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTUwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAiIHg9IjYwIiB5PSIxNTAiIGZpbGw9IiNkNmMzYmUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNjAiIHk9IjE1MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjUwIiB5PSIxNjAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMCIgeD0iNjAiIHk9IjE2MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI2MCIgeT0iMTYwIiBmaWxsPSIjMWYxZDI5IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE3MCIgZmlsbD0iIzFmMWQyOSIgLz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwIiB4PSI2MCIgeT0iMTcwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjYwIiB5PSIxNzAiIGZpbGw9IiMxZjFkMjkiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTgwIiBmaWxsPSIjNGI0OTQ5IiAvPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTgwIiBmaWxsPSIjNjI2MTZkIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMjEwIiB5PSIxODAiIGZpbGw9IiM0YjQ5NDkiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTkwIiBmaWxsPSIjNGI0OTQ5IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxOTAiIGZpbGw9IiM2MjYxNmQiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjE5MCIgZmlsbD0iIzYyNjE2ZCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTkwIiBmaWxsPSIjNjI2MTZkIiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxOTAiIGZpbGw9IiM0YjQ5NDkiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMjAwIiBmaWxsPSIjNGI0OTQ5IiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMDAiIGZpbGw9IiM2MjYxNmQiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjIwMCIgZmlsbD0iIzRiNDk0OSIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTEwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxMTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjEyMCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTIwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxMjAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjEyMCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTIwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxMjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjEyMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTIwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjEzMCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTMwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxMzAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjEzMCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTMwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxMzAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjEzMCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSIxNDAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE0MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMTQwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxNDAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjE0MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTQwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxNDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjE0MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTQwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjE1MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTUwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNTAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjE1MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTUwIiBmaWxsPSIjZWM1YjQzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE1MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxNTAiIGZpbGw9IiNlYzViNDMiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxMDAiIHk9IjE2MCIgZmlsbD0iI2VjNWI0MyIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMTYwIiBmaWxsPSIjZWM1YjQzIiAvPjwvc3ZnPg=="
                              }
                            />
                          </div>
                        </div>
                        <div className="chat-bubble">
                          {isUserMessage
                            ? message.replace("User:", "")
                            : message}
                        </div>
                      </div>
                    );
                  })}
                  {isAgentTyping && (
                    <div className="chat chat-start">
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img
                            alt="Avatar"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          />
                        </div>
                      </div>
                      <div className="chat-bubble">...</div>
                    </div>
                  )}
                </div>
                {/* Input Section */}
                <div className="p-4 border-t border-gray-300">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                      disabled={isAgentTyping}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="btn btn-primary btn-sm rounded-full"
                      disabled={
                        isAgentTyping ||
                        currentQuestionIndex >= questions.length
                      }
                    >
                      Send
                    </button>
                  </div>
                </div>
                {/* Proceed Button */}
                <div className="flex flex-row-reverse mt-8 pr-8 w-full mr-4 mb-8">
                  <NextLink href="/dashboard">
                    <button
                      className="btn btn-outline btn-lg rounded-full p-4 text-black"
                      disabled={currentQuestionIndex < questions.length}
                    >
                      Proceed
                    </button>
                  </NextLink>
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
