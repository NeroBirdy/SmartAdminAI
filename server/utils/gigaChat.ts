import { GigaChat } from "gigachat";
import { Agent } from "node:https";
import { usePrisma } from "./prisma";

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const gigachat = new GigaChat({
  timeout: 600,
  model: "GigaChat-2-Pro",
  credentials: process.env.GIGACHAT_CRED,
  scope: process.env.GIGACHAT_SCOPE,
  httpsAgent: httpsAgent,
});

export const useGigaChat = () => {
  return gigachat;
};

const prisma = usePrisma();

type ParsedItem = {
  title: string;
  text: string;
};

export class GigaChatAnalitics {
  async sendMessage(
    instruction: string,
    message: string,
  ): Promise<ParsedItem[]> {
    const response = await gigachat.chat({
      messages: [
        { role: "system", content: instruction },
        { role: "user", content: message },
      ],
    });

    const choice = response.choices[0];

    if (!choice?.message?.content) {
      throw new Error("Пустой ответ от Gigachat");
    }

    const textResponse = choice.message.content;
    const parsedResponse = this.parseResponse(textResponse);

    return parsedResponse;
  }

  parseResponse(text: string): ParsedItem[] {
    const result: ParsedItem[] = [];
    const lines = text.split("\n");
    let currentKey: string | null = null;

    for (const line of lines) {
      const keyMatch = line.match(/\*\*(.+?)\*\*/);
      if (keyMatch) {
        currentKey = keyMatch[1]!.trim();
        continue;
      }

      if (currentKey && line.trim().startsWith("-")) {
        const value = line.trim().substring(1).trim();
        result.push({
          title: currentKey,
          text: value,
        });
      }
    }
    return result;
  }
}
