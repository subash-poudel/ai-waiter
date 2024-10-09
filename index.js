import { ChatVertexAI } from "@langchain/google-vertexai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as dotenv from 'dotenv';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";



dotenv.config();

// console.log('envs', process.env);
const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0,
  apiKey: "",

});

const systemTemplate = "Translate the following into {language}:";
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
  ]);

  const promptValue = await promptTemplate.invoke({
    language: "italian",
    text: "hi",
  });

  console.log(promptValue.toChatMessages());
  const parser = new StringOutputParser();
  const llmChain = promptTemplate.pipe(model).pipe(parser);
  const response = await llmChain.invoke({ language: "italian", text: "hi" });

  console.log('response', response);
// const messages = [
//     new SystemMessage("Translate the following from English into Italian"),
//     new HumanMessage("hi!"),
//   ];
// console.log('before model');
// // const modelResponse = await model.invoke(messages);
// // console.log('after model', modelResponse);
// const parser = new StringOutputParser();
// const chain = model.pipe(parser);
// const strResult = await chain.invoke(messages);
// console.log('str result', strResult);


