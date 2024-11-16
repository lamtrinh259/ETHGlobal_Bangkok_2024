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

      const voteDaoAddress = "0xf25469bdf21c06aff3f4236b8e0ca1b51c9e5ec6";
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
                              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
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
