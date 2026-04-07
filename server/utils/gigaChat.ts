import { GigaChat } from "gigachat";
import { Agent } from "node:https";
import { usePrisma } from "./prisma";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
  async sendMessage(message: string): Promise<ParsedItem[]> {
    const filePath = join(
      process.cwd(),
      "app",
      "assets",
      "prompts",
      "knowledge.md",
    );
    const file = await readFile(filePath, "utf-8");

    let response = await gigachat.chat({
      messages: [
        { role: "system", content: file },
        { role: "user", content: message },
      ],
    });

    let choice = response.choices[0];

    if (!choice?.message?.content) {
      throw new Error("Пустой ответ от Gigachat");
    }

    let textResponse = choice.message.content;

    response = await gigachat.chat({
      messages: [
        // {
        //   role: "system",
        //   content: `В ответе не нужно нумеровать и не нужно ставить двоеточие в заголовоках. Формат ответа: Твой формат ответа : "** Заголовок" "- Описание рекомендации".
        //   Не добавляй ничего нового в текст, только исправь, если нужно этот текст.`,
        // },
        {
          role: "user",
          content: `В ответе не нужно нумеровать и не нужно ставить двоеточие в заголовоках. Формат ответа: Твой формат ответа : "** Заголовок" "- Описание рекомендации". 
          Не добавляй ничего нового в текст, только исправь, если нужно этот текст. \n ${textResponse}`,
        },
      ],
    });

    choice = response.choices[0];

    if (!choice?.message?.content) {
      throw new Error("Пустой ответ от Gigachat");
    }

    textResponse = choice.message.content;

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

export class GigaChatSchedule {
  async sendMessage(message: string) {
    let response = await gigachat.chat({
      messages: [
        {
          role: "system",
          content: `# Генерация расписания для детской секции.
## Задача:
Ты – администратор, работающий в детской секции.
Твоя задача – **Составить оптимальное расписание занятий на заданный горизонт планирования и учесть все влияющие на это факторы**.
**Расписание должно быть полным на весь период, для каждой группы, оно отправляется всем клиентам и сотрудникам, чтобы по нему могли заниматься в секции***

## Общие правила:
1.    Занятия должны начинаться не ранее 08:00 и заканчиваться не позднее 20:00 (Для подростков 16-18 лет допускается до 21:00)
2.    Пик активности у детей приходится на 10:00-12:00 и 16:00-18:00. Подходит для более интенсивных тренировок и сложных занятий.
3.    Между группами у одного тренера, в одной локации должна быть переменка 15 минут.
4.    Перерыв после школы должен быть не менее 30 минут.
5.    Расписание учебных смен в большинстве школ с 08:00 до 13:00 и с 13:00 до 18:00.
6.    Оптимальное количество занятий в неделю 2-3 для одной группы.
7.    Время проведения одного занятия 60 минут.
8.    Расписание должно быть полным охватывать весь период и группы.
9.    Начинай планировать со следующего дня, от текущей даты.

## Контекст
- Ты получаешь данные о конкретной организации.
- Горизонт планирование - то на какой временной промежуток необходимо создать расписание
- Количество инструкторов, групп и площадок для проведения занятий.
- Таблица с графиками работы (они могут быть как организации, так и конкретного сотрудника или площадки) в них хранится информация о том кому принадлежит этот график, день недели, является ли он рабочим или выходным, время начала и окончания рабочего дня, а так же перерывы в течение дня когда объект не работает.
- Таблица с информацией о группах. В ней хранятся все связи, какой инструктор должен вести занятие, на какой площадке оно проходит, по какой программе занимаются и какая возрастная категория у детей в группе (информация о тренерах, площадках и программах представляют собой их Id из базы данных).

## Формат ответа

lessons:
[
    {
        date: "Дата занятия",
        startTime: "Время начал занятия ЧЧ:ММ",
        endTime: "Время окончания занятия ЧЧ:ММ"
        groupId: "Id группы",
        instructorId: "Id инструктора",
        programId: "Id программы",
        venueId: "Id площадки",
    },
//все созданные занятия необходимо сделать ниже в таком же формате
]`,
        },
        { role: "user", content: message },
      ],
    });
    const choice = response.choices[0];

    if (!choice?.message?.content) {
      throw new Error("Пустой ответ от Gigachat");
    }

    const textResponse = choice.message.content;

    return textResponse;
  }
}
