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
      ]),
    ];

    const mdTable = markdownTable(tableData);

    prompt += mdTable;

    return prompt;
  }
});
