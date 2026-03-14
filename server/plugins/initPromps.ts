import { initPrompts } from "../utils/prompts";

export default defineNitroPlugin(async () => {
  try {
    await initPrompts();
    console.log("Промпты успешно инициализированы при старте!");
  } catch (error) {
    console.error("Ошибка инициализации промптов:", error);
  }
});
