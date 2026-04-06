export { prompts, initPrompts };

const prisma = usePrisma();

const prompts = {
  promptRisk: "",
  promptRec: "",
};

let isInitialized = false;

async function initPrompts(): Promise<void> {
  if (isInitialized) return;

  const getPrompt = async (id: number): Promise<string> => {
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      select: { text: true },
    });

    if (!prompt?.text) {
      throw new Error(`Промпт с ID ${id} не найден`);
    }

    return prompt.text;
  };

  const [promptRec, promptRisk] = await Promise.all([
    getPrompt(1),
    getPrompt(2),
  ]);

  prompts.promptRisk = promptRisk;
  prompts.promptRec = promptRec;

  isInitialized = true;
}
