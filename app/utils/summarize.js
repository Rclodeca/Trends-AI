import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { CombineDocumentsChain } from "langchain/chains";
import { Document } from "langchain/document";
import { getRawJSON } from "./store";

const PROMPT_ROUTE = "@/store/prompts/summarize.json"

export function formatForSummarization(articles) {
    return articles.map(art => {
        return Object.keys(art).reduce((acc, cur) => {
            return acc += `${cur}: ${art[cur]}`
        }, "");
    });
}

export async function summarizeArticles(articles) {
    const llm = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0,
        modelName: "gpt-4",
    });
    const template = getRawJSON(PROMPT_ROUTE).prompt.v1

    // Define a summary prompt
    const summaryPrompt = new PromptTemplate({
        inputVariables: ["text"],
        template
    });

    // CombineDocumentsChain: Summarizes all articles into one
    const combineChain = new CombineDocumentsChain({
        llm,
        prompt: summaryPrompt,
        inputKey: "text",
    });

    // Convert articles into LangChain Document objects
    const documents = articles.map((article) => new Document({ pageContent: article }));

    return await combineChain.run(documents);
}

