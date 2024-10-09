import { ChatVertexAI } from "@langchain/google-vertexai";
import * as readline from "readline";
import { ConversationChain } from "langchain/chains";
import * as dotenv from "dotenv";
import { MY_MENU } from "./menu.js";


dotenv.config();

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0,
});

const agent = new ConversationChain({
  llm: llm,
});

const prompt = `
You are an AI Waiter at a mixed crusine restaurant. Help customers by answering their questions about the menu and taking their orders. Here is the menu as a json string:
${JSON.stringify(MY_MENU)}
Dont recommend any dishes outside of above menu.
When customer asks for bill or total provide the total cost of their meal too.
Provide the output in following json format without any markdowns {"answer": "ai response", "followup": "Next question"}
How can I assist you today? You can ask about ingredients, prices, or recommendations.
`;
let followupQuestion = "Anything else?: ";

const interaction = async (userInput) => {
  const response = await agent.call({
    input: `${prompt}\nCustomer: ${userInput}\nWaiter:`,
  });
  const removedJsonAttribute = response.response.replaceAll('```json', '').replaceAll('```', '');
  const responseJson = JSON.parse(removedJsonAttribute);
//   For debugging
//   console.log('=========================================');
//   console.log(response);
//   console.log('=========================================');
  console.log(responseJson.answer);
  console.log("\n");
  followupQuestion = responseJson.followup + " ";
};

const lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function handleCloseOrContinueSession(userInput, lineReader) {
  if (userInput.toLowerCase().includes("bill")) {
    lineReader.close();
  } else {
    askAiWaiter(followupQuestion);
  }
}

function askAiWaiter(question) {
  lineReader.question(question, async (userInput) => {
    await interaction(userInput);
    handleCloseOrContinueSession(userInput, lineReader);
  });
}

askAiWaiter("Ask the AI Waiter a question: ");
