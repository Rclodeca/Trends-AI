import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StuffDocumentsChain, LLMChain, } from "langchain/chains";
import { Document } from "langchain/document";
import { getPrompt } from "./store";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const PROMPT_ROUTE = "store/prompts/summarize.txt";


export function formatForSummarization(articles) {
    return articles.map(art => 
        Object.keys(art).reduce((acc, cur) => acc += `${cur}: ${art[cur]}`, "")
    );
}

export async function summarizeArticlesByTopic(topic, articles) {
    const llm = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0,
        model: "gpt-3.5-turbo",
    });

    const template = await getPrompt(PROMPT_ROUTE)

    // Define a summary prompt
    const summaryPrompt = ChatPromptTemplate.fromTemplate(template);

    const ragChain = await createStuffDocumentsChain({
        llm,
        prompt: summaryPrompt
      });

    
    // Convert articles into LangChain Document objects
    const documents = articles.map((article) => new Document({ pageContent: article }));

    return await ragChain.invoke({ topic, context: documents });
}

