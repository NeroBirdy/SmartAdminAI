export { prompts, initPrompts };

const prisma = usePrisma();

const prompts = {
  instructionRisk: "",
  instructionRec: "",
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

  const [instructionRisk, instructionRec] = await Promise.all([
    getPrompt(5),
    getPrompt(6),
  ]);

  prompts.instructionRisk = instructionRisk;
  prompts.instructionRec = instructionRec;

  isInitialized = true;
}
