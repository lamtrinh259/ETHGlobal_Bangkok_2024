import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import OpenAI from "openai";
import dotenv from 'dotenv';
import cors from 'cors';
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import express from 'express';
import { mockProposals } from './proposals.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

const openAIKey = process.env.OPENAI_API_KEY

if (openAIKey === undefined || !openAIKey) {
  throw new Error("openAI");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/proposals', async (req: Request, res: Response) => {
  let { chatHistory, selectedDaos, id } = req.body;
  if (!id) { id = 0; }

  if (!Array.isArray(selectedDaos) || selectedDaos.length !== 1 || selectedDaos[0].toLowerCase() !== 'CharityDAO') {
    res.status(400).json({
      error: 'Invalid selected Daos. Only ["CharityDAO"] is currently supported.'
    });
  }

  const filteredProposals = mockProposals
    .filter(p => p.dao.toLowerCase() === selectedDaos[0].toLowerCase())
    .filter(p => !id || p.id === id);

  if (filteredProposals.length === 0) {
    res.status(400).json({
      error: `No proposals found for selected DAO and ID`
    });
  }
  try {
    const systemPrompt = `You are an AI agent whose job is to vote on DAO governance proposals, in particular this proposal:" ${filteredProposals[0].description}" on behalf of the users.
                           You will receive a conversation from users as inputs to instruct you on the user's preferences and chat history.
                           Your role is to choose the decision that aligns the most with the user's preferences.
                           There's no right or wrong answer, but the output must be in this JSON format "{vote: Yes|No|Abstain, reasoning: reason}" with vote being Yes or No or Abstain and reason being a short 1-2 sentences describing the reason why.
                           Your only answer must be the valid json as described above.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
      ],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    console.log(aiResponse)
    const proposalsWithRecommendations = filteredProposals.map(proposal => ({
      dao: filteredProposals[0].dao,
      description: filteredProposals[0].description,
      vote: 'Yes',
      reasoning: aiResponse,
    }));

    res.json({ proposals: proposalsWithRecommendations });

  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Failed to process proposals' });
  }
});

const PORT = 9990;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
