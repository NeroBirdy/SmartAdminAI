import { GigaChatAnalitics } from "../utils/gigaChat";
import { prompts } from "../utils/prompts";
import { subMonths, isBefore } from "date-fns";
import { Risk, Recommendation } from "../../generated/prisma/client";

const sectionId = 1;
let risks = {};
let recommendations = {};

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
  const lastRecordRisk = await getLastRecord("risk");
  const lastRecordRec = await getLastRecord("recommendation");

  const today = new Date();
  const oneMonthAgo = subMonths(today, 1);
  const gigaChat = new GigaChatAnalitics();

  if (!lastRecordRisk) {
    risks = await getRiskOrRec(gigaChat, "risk");
  } else {
    const isOlder = isBefore(lastRecordRisk.createdAt, oneMonthAgo);
    if (isOlder) {
      risks = await getRiskOrRec(gigaChat, "risk");
    } else {
      risks = await getRecords("risk");
    }
  }

  if (!lastRecordRec) {
    recommendations = await getRiskOrRec(gigaChat, "recommendation");
  } else {
    const isOlder = isBefore(lastRecordRec.createdAt, oneMonthAgo);
    if (isOlder) {
      recommendations = await getUpdatedRec(gigaChat);
    } else {
      recommendations = await getRecords("recommendation");
    }
  }

  return {
    risks: risks,
    recommendations: recommendations,
  };
});

const getRiskOrRec = async (
  gigaChat: GigaChatAnalitics,
  type: "risk" | "recommendation",
) => {
  let prompt: string = "";
  let instruction: string = "";
  if (type == "risk") {
    prompt = prompts.risk;
    instruction = prompts.instructionRisk;
  } else {
    prompt = prompts.recommendation;
    instruction = prompts.instructionRec;
  }
  const parsedResponse = await gigaChat.sendMessage(instruction, prompt);

  return await createAndReturn(parsedResponse, type);
};

const getUpdatedRec = async (gigaChat: GigaChatAnalitics) => {
  let promptAppend: string = "";
  const records = (await getRecords(
    "recommendation",
  )) as RecommendationOutput[];
  for (const item of records) {
    promptAppend += `**${item.title}**\n`;
    promptAppend += `-${item.text}\n`;
    promptAppend += `Выполнено:${item.done ? "да" : "нет"}\n`;
  }

  const prompt = prompts.recommendation + promptAppend;

  const parsedResponse = await gigaChat.sendMessage(
    prompts.instructionRec,
    prompt,
  );

  return await createAndReturn(parsedResponse, "recommendation");
};

const getRecords = async (
  type: "risk" | "recommendation",
): Promise<RiskOutput[] | RecommendationOutput[]> => {
  const records = await fetchRecords(type);

  return mapRecords(records, type);
};

const fetchRecords = async (
  type: "risk" | "recommendation",
): Promise<Risk[] | Recommendation[]> => {
  const lastRecord = await getLastRecord(type);

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

  return await getRecords(type);
};
