import { GigaChatAnalitics } from "../utils/gigaChat";
import { prompts } from "../utils/prompts";
import { subMonths, isBefore } from "date-fns";
import { Risk, Recommendation } from "../../generated/prisma/client";

const prisma = usePrisma();

type RiskOutput = { id: number; title: string; text: string };
type RecommendationOutput = {
  id: number;
  title: string;
  text: string;
  done: boolean;
};

type ParsedItem = {
  title: string;
  text: string;
};

export default defineEventHandler(async (event) => {
  const sectionId = 1;
  let risks = {};
  let recommendations = {};

  const lastRecordRisk = await getLastRecord("risk", sectionId);
  const lastRecordRec = await getLastRecord("recommendation", sectionId);

  const today = new Date();
  const oneMonthAgo = subMonths(today, 1);
  const gigaChat = new GigaChatAnalitics();

  if (!lastRecordRisk) {
    risks = await getRiskOrRec(gigaChat, "risk", sectionId);
  } else {
    const isOlder = isBefore(lastRecordRisk.createdAt, oneMonthAgo);
    if (isOlder) {
      risks = await getRiskOrRec(gigaChat, "risk", sectionId);
    } else {
      risks = await getRecords("risk", sectionId);
    }
  }

  if (!lastRecordRec) {
    recommendations = await getRiskOrRec(gigaChat, "recommendation", sectionId);
  } else {
    const isOlder = isBefore(lastRecordRec.createdAt, oneMonthAgo);
    if (isOlder) {
      recommendations = await getUpdatedRec(gigaChat, sectionId);
    } else {
      recommendations = await getRecords("recommendation", sectionId);
    }
  }

  return {
    risks: risks,
    recommendations: recommendations,
  };
});

const getRiskOrRec = async (
  //Нужно поменять
  gigaChat: GigaChatAnalitics,
  type: "risk" | "recommendation",
  sectionId: number,
) => {
  let instruction: string = "";
  if (type == "risk") {
    instruction = prompts.instructionRisk;
  } else {
    instruction = prompts.instructionRec;
  }

  const prompt = await $fetch<string>("/api/getDataForPrompt");

  const parsedResponse = await gigaChat.sendMessage(instruction, prompt);
  return await createAndReturn(parsedResponse, type, sectionId);
};

const getUpdatedRec = async (
  gigaChat: GigaChatAnalitics,
  sectionId: number,
) => {
  let prompt =
    "При проведение анализа учти данные ниже это твоих рекомендации с прошлого месяца и были ли они выполнины\n";
  const records = (await getRecords(
    "recommendation",
    sectionId,
  )) as RecommendationOutput[];
  for (const item of records) {
    prompt += `**${item.title}**\n`;
    prompt += `-${item.text}\n`;
    prompt += `Выполнено:${item.done ? "да" : "нет"}\n`;
  }

  prompt += await $fetch<string>("/api/getDataForPrompt");

  const parsedResponse = await gigaChat.sendMessage(
    prompts.instructionRec,
    prompt,
  );

  return await createAndReturn(parsedResponse, "recommendation", sectionId);
};

const getRecords = async (
  type: "risk" | "recommendation",
  sectionId: number,
): Promise<RiskOutput[] | RecommendationOutput[]> => {
  const records = await fetchRecords(type, sectionId);

  return mapRecords(records, type);
};

const fetchRecords = async (
  type: "risk" | "recommendation",
  sectionId: number,
): Promise<Risk[] | Recommendation[]> => {
  const lastRecord = await getLastRecord(type, sectionId);

  if (type === "risk") {
    return (await prisma.risk.findMany({
      where: {
        sectionId: sectionId,
        createdAt: lastRecord!.createdAt,
      },
      orderBy: { createdAt: "desc" },
    })) as Risk[];
  }
  return (await prisma.recommendation.findMany({
    where: {
      sectionId: sectionId,
      createdAt: lastRecord!.createdAt,
    },
    orderBy: { createdAt: "desc" },
  })) as Recommendation[];
};

const mapRecords = (
  records: (Risk | Recommendation)[],
  type: "risk" | "recommendation",
): (RiskOutput | RecommendationOutput)[] => {
  if (type === "risk") {
    return (records as Risk[]).map((r) => ({
      id: r.id,
      title: r.title,
      text: r.text,
    })) as RiskOutput[];
  } else {
    return (records as Recommendation[]).map((r) => ({
      id: r.id,
      title: r.title,
      text: r.text,
      done: r.done,
    })) as RecommendationOutput[];
  }
};

const getLastRecord = async (
  type: "risk" | "recommendation",
  sectionId: number,
): Promise<Risk | Recommendation> => {
  if (type == "risk") {
    return (await prisma.risk.findFirst({
      where: { sectionId: sectionId },
      orderBy: { createdAt: "desc" },
    })) as Risk;
  }
  return (await prisma.recommendation.findFirst({
    where: { sectionId: sectionId },
    orderBy: { createdAt: "desc" },
  })) as Recommendation;
};

const createAndReturn = async (
  parsedResponse: ParsedItem[],
  type: "risk" | "recommendation",
  sectionId: number,
): Promise<RiskOutput[] | RecommendationOutput[]> => {
  const data = parsedResponse.map((item) => ({
    title: item.title,
    text: item.text,
    sectionId: sectionId,
  }));

  if (type == "risk") {
    await prisma.risk.createMany({ data });
  } else {
    await prisma.recommendation.createMany({ data });
  }

  return await getRecords(type, sectionId);
};
