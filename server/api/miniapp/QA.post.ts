import { readFile } from "node:fs/promises";
import { join } from "node:path";

type OllamaResponse = {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  model: string;
};

const filePath = join(
  process.cwd(),
  "app",
  "assets",
  "prompts",
  "QAInstruction.txt",
);

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;
  const question = body.question;

  const user = await getUser({ peerId: userId });

  let prompt = `Данные клиента:\n`;
  prompt += `${JSON.stringify(await getClientInfo(user?.key!), null, 2)} \n\n`;

  prompt += `Данные организации:\n`;
  prompt += `${JSON.stringify(await getOrganisationInfo(user?.key!), null, 2)} \n\n`;

  prompt += `Вопрос:\n`;
  prompt += `${question}`;

  return await sendRequest(prompt);
});

const getClientInfo = async (key: string) => {
  const client = await fakeAPI.client.findFirst({
    where: { accessCode: String(key) },
    select: {
      firstName: true,
      lastName: true,
      gender: true,
      birthDate: true,
      group: {
        include: {
          defaultVenue: true,
          additionalVenues: true,
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              organizationId: true,
            },
          },
          program: true,
        },
      },
    },
  });

  return client;
};

const getOrganisationInfo = async (key: string) => {
  const client = await fakeAPI.client.findFirst({
    where: { accessCode: key },
    include: { group: true },
  });

  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const organisation = await fakeAPI.organization.findFirst({
    where: { id: client?.group?.organizationId },
    include: {
      city: true,
      employees: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          organizationId: true,
        },
      },
      groups: {
        include: {
          defaultVenue: true,
          additionalVenues: true,
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              organizationId: true,
            },
          },
          lessons: {
            where: {
              date: {
                gte: today,
                lte: twoWeeksLater,
              },
            },
          },
          program: true,
        },
      },
    },
  });

  return organisation;
};

const sendRequest = async (message: string) => {
  const systemPrompt = await readFile(filePath, "utf-8");

  const response = await $fetch<OllamaResponse>(
    "http://localhost:11434/api/chat",
    {
      method: "POST",
      body: {
        model: "gpt-oss:120b-cloud",
        think: "medium",
        stream: false,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
    },
  );

  return response.message.content;
};
