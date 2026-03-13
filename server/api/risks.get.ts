import { gigachat } from "../utils/gigaChat";
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { subMonths, isBefore, startOfDay, endOfDay } from 'date-fns'

const sectionId = 1;
let risks = {};
let recommendations = {};

export default defineEventHandler(async (event) => {

  const lastRecordRisk = await prisma.risk.findFirst({ where: { sectionId: sectionId }, orderBy: { createdAt: 'desc' } });
  const lastRecordRec = await prisma.recommendation.findFirst({ where: { sectionId: sectionId }, orderBy: { createdAt: 'desc' } });

  if (!lastRecordRisk) {
    const parsed = await requestGigaChat('risk', null);

    const data = parsed.map((item) => ({
      title: item.title,
      text: item.text,
      sectionId: sectionId
    }));

    await prisma.risk.createMany({ data });
    risks = await getData('risk', new Date());
    risks = await getData('risk', new Date());
  } else {
    const oneMonthAgo = subMonths(new Date(), 1);
    const isOlder = isBefore(lastRecordRisk.createdAt, oneMonthAgo);

    const targetDate = lastRecordRisk.createdAt;
    const temp = await getData('risk', targetDate);


    if (isOlder) {
      const parsed = await requestGigaChat('risk', null);

      const data = parsed.map((item) => ({
        title: item.title,
        text: item.text,
        sectionId: sectionId
      }));

      await prisma.risk.createMany({ data });
      risks = await getData('risk', new Date());;
      risks = await getData('risk', new Date());;
    } else {
      risks = temp;
    }
  }

  if (!lastRecordRec) {
    const parsed = await requestGigaChat('rec', null);

    const data = parsed.map((item) => ({
      title: item.title,
      text: item.text,
      sectionId: sectionId
    }));

    await prisma.recommendation.createMany({ data });
    recommendations = await getData('rec', new Date());
    recommendations = await getData('rec', new Date());
  } else {
    const oneMonthAgo = subMonths(new Date(), 1);
    const isOlder = isBefore(lastRecordRec.createdAt, oneMonthAgo);

    const targetDate = lastRecordRec.createdAt;
    const temp = await getData('rec', targetDate);
    let textForPrompt = 'При проведение анализа учти данные ниже это твои рекомендации с прошлого месяца и были ли они выполнены \n';
    if (isOlder) {

      for (const item of temp) {
        textForPrompt += `**${item.title}**\n -${item.text}\n Выполнено:${item.done ? 'да' : 'нет'}\n`;
      }
      const parsed = await requestGigaChat('rec', textForPrompt);

      const data = parsed.map((item) => ({
        title: item.title,
        text: item.text,
        sectionId: sectionId
      }));

      await prisma.recommendation.createMany({ data });
      recommendations = await getData('rec', new Date());
      recommendations = await getData('rec', new Date());
    } else {
      recommendations = temp;
    }
  }

  return {
    risks: risks, recommendations: recommendations
  };
});

async function getData(type: string, targetDate: Date) {
  let list = {};
  const dateStart = startOfDay(targetDate);
  const dateEnd = endOfDay(targetDate);
  if (type == 'risk') {
    const records = await prisma.risk.findMany({
      where: {
        sectionId: sectionId,
        createdAt: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    list = records.map(record => ({
      id: record.id,
      title: record.title,
      text: record.text,
    }))
  } else {
    const records = await prisma.recommendation.findMany({
      where: {
        sectionId: sectionId,
        createdAt: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    list = records.map(record => ({
      id: record.id,
      title: record.title,
      text: record.text,
      done: record.done
    }))
  }
  return list;
};

async function requestGigaChat(type: string, promptUpgrade: string | null) {
  const filePathIns = join(process.cwd(), 'app', 'assets', 'prompts', 'instruction.txt');
  const instruction = await readFile(filePathIns, 'utf-8');
  let response;
  if (type == 'risk') {
    const filePathRisk = join(process.cwd(), 'app', 'assets', 'prompts', 'promptRisk.txt');
    let promptRisk = await readFile(filePathRisk, 'utf-8');
    response = await gigachat.chat({ messages: [{ role: 'system', content: instruction }, { role: 'user', content: promptRisk }] },);
  } else {
    const filePathRec = join(process.cwd(), 'app', 'assets', 'prompts', 'promptRec.txt');
    let promptRec = await readFile(filePathRec, 'utf-8');
    if (promptUpgrade != null) {
      promptRec += promptUpgrade;
    }
    response = await gigachat.chat({ messages: [{ role: 'system', content: instruction }, { role: 'user', content: promptRec }] },);
  }

  const ans = response.choices[0]?.message.content;
  return parseFormattedText(ans!);
};

interface ParsedItem {
  title: string;
  text: string;
}

function parseFormattedText(text: string): ParsedItem[] {
  const result: ParsedItem[] = [];
  const lines = text.split('\n');
  let currentKey: string | null = null;

  for (const line of lines) {
    const keyMatch = line.match(/\*\*(.+?)\*\*/);
    if (keyMatch) {
      currentKey = keyMatch[1]!.trim();
      continue;
    }

    if (currentKey && line.trim().startsWith('-')) {
      const value = line.trim().substring(1).trim();
      result.push({
        title: currentKey,
        text: value
      });
    }
  }

  return result;
}