import responseJson from "~/assets/prompts/response.json";
import { markdownTable } from "markdown-table";

export default defineEventHandler(async (event) => {
  let prompt = "";

  const response = responseJson.response[0]; //Тут должен быть запрос с api
  if (response) {
    prompt = `Наименование организации: ${response.name}\n`;
    prompt += `Вид: ${response.type}\n`;
    prompt += `Город: ${response.city}\n\n`;

    const performanceIndicators = response.performanceIndicators;

    const formatArray = (arr: string[] | undefined): string =>
      Array.isArray(arr) ? arr.join(", ") : "—";

    const formatSexRatio = (
      ratio: { male?: number; female?: number; men?: number } | undefined,
    ): string => {
      if (!ratio) return "—";
      const male = ratio.male ?? ratio.men ?? 0;
      const female = ratio.female ?? 0;
      return `М: ${male}%, Ж: ${female}%`;
    };

    const tableData = [
      // Заголовки
      [
        "Период",
        "Активные клиенты",
        "Новые клиенты",
        "Возвратные клиенты",
        "Всего посещений",
        "Заполняемость, %",
        "Прибыль, ₽",
        "Средний доход на клиента, ₽",
        "Проведено занятий",
        "Средняя оценка занятий",
        "Количество групп",
        "Количество инструкторов",
        "Виды занятий",
        "Соотношение полов клинентов",
        "Вид оплаты",
        "Возростные группы клиентов",
      ],
      // Строки данных
      ...performanceIndicators.map((item: any) => [
        item.period,
        item.activeClients,
        item.newClients,
        item.returnClients,
        item.totalVisits,
        `${item.occupancyRate}%`,
        item.profit.toLocaleString("ru-RU"),
        item.averageProfitFromClient.toLocaleString("ru-RU"),
        item.lessonsConducted,
        item.averageScore,
        item.groupCount,
        item.coachCount,
        formatArray(item.lessonsType),
        formatSexRatio(item.sexRatio),
        formatArray(item.paymentType),
        formatArray(item.ageGroup),
      ]),
    ];

    const mdTable = markdownTable(tableData);

    prompt += mdTable;

    return prompt;
  }
});
