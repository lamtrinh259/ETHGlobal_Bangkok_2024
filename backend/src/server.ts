import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import OpenAI from "openai";
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { mockProposals } from './proposals.js';
import { mockQuestions } from './questions.js';
import { ethers } from 'ethers';

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

const openAIKey = process.env.OPENAI_API_KEY
const privateKey = process.env.PRIVATE_KEY
const rpcUrl = process.env.RPC_URL
const voteTokenAddress = process.env.VOTE_TOKEN_ADDRESS

if (voteTokenAddress == undefined || openAIKey === undefined || !openAIKey || privateKey === undefined || !privateKey || rpcUrl === undefined || !rpcUrl) {
  throw new Error(".env not set - requires OPENAI_API_KEY, PRIVATE_KEY, and RPC_URL");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/proposals', async (req: any, res: any) => {
  let { chatHistory, selectedDaos, id } = req.body;
  if (!id) { id = 0; }

  if (!Array.isArray(selectedDaos) || selectedDaos.length !== 1 || selectedDaos[0].toLowerCase() !== 'charitydao') {
    return res.status(400).json({
      error: 'Invalid selectedDaos. Only ["charitydao"] is currently supported.'
    });
  }

  if (!Array.isArray(chatHistory) || !chatHistory.every(msg => 
    msg.role && 
    ['user', 'assistant'].includes(msg.role) && 
    typeof msg.content === 'string'
  )) {
    return res.status(400).json({
      error: 'Invalid chat history format. Each message must have role (user/assistant) and content'
    });
  }

  const filteredProposals = mockProposals
    .filter(p => p.dao.toLowerCase() === selectedDaos[0].toLowerCase())
    .filter(p => !id || p.id === id);

  if (filteredProposals.length === 0) {
    return res.status(400).json({
      error: `No proposals found for selected DAO and ID`
    });
  }
  try {

    const systemPrompt = `You are an AI agent whose job is to vote on DAO governance proposals, in particular this proposal:" ${filteredProposals[0].description}" on behalf of the users.
    You will receive a conversation from users as inputs to instruct you on the user's preferences and chat history.
    Your role is to choose the decision that aligns the most with the user's preferences.
    There's no right or wrong answer, but the output must be in this JSON format "{vote: Yes|No|Abstain, reasoning: reason}" with vote being Yes or No or Abstain and reason being a short 1-2 sentences describing the reason why.
    Your only answer must be the valid json as described above`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
      ],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    if (!aiResponse) {
      return res.status(400).json({ error: 'Empty response from AI' });
    }

    const parsedResponse = JSON.parse(aiResponse);

    if (!parsedResponse.vote || !parsedResponse.reasoning ||
      !['YES', 'NO', 'ABSTAIN'].includes(parsedResponse.vote.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid AI response format' });
    }

    const voteToNumber: { [key: string]: number } = {
      'YES': 0,
      'NO': 1,
      'ABSTAIN': 2
    };


    const proposalsWithRecommendations = filteredProposals.map(proposal => ({
      dao: proposal.dao,
      description: proposal.description,
      vote: voteToNumber[parsedResponse.vote.toUpperCase()],
      reasoning: parsedResponse.reasoning,
    }));

    res.json({ proposals: proposalsWithRecommendations });

  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return res.status(500).json({ error: 'Failed to process proposals' });
  }
});

app.get('/questions', (req: any, res: any) => {
  const { selectedDaos } = req.query;

  if (!Array.isArray(selectedDaos) ||
    selectedDaos.length !== 1 ||
    typeof selectedDaos[0] !== 'string' ||
    selectedDaos[0].toString().toLowerCase() !== 'charitydao') {
    return res.status(400).json({
      error: 'Invalid selectedDaos. Only ["charitydao"] is currently supported.'
    });
  }

  res.json({
    questions: mockQuestions,
  });
});

app.post('/airdrop', async (req: any, res: any) => {
  const { walletAddress, signature } = req.body; //todo: validate signature

  if (!walletAddress || !ethers.isAddress(walletAddress)) {
    return res.status(400).json({
      error: 'Invalid selectedDaos. Only ["charitydao"] is currently supported.'
    });
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey!, provider);
    const abi = ['function airdrop(address to, uint256 amount) external'];
    const contract = new ethers.Contract(voteTokenAddress, abi, signer);

    const amount = ethers.parseEther('1');
    const tx1 = await contract.airdrop(walletAddress, amount);
    await tx1.wait();
    const tx2 = await signer.sendTransaction({
      to: walletAddress,
      value: ethers.parseEther('0.01')
    });
    await tx2.wait();

    res.json({
      success: true,
      tokenTxHash: tx1.hash,
      ethTxHash: tx2.hash
    });

  } catch (error) {
    console.error('Airdrop error:', error);
    return res.status(500).json({ error: 'Failed to process airdrop' });
  }
});


const PORT = 9999;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});