const prisma = usePrisma();

export const prompts = {
  instructionRisk: "",
  instructionRec: "",
  recommendation: "",
  risk: "",
};

let isInitialized = false;

export async function initPrompts(): Promise<void> {
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

  const [instructionRisk, instructionRec, recommendation, risk] = await Promise.all([
    getPrompt(5),
    getPrompt(6),
    getPrompt(7),
    getPrompt(8),
  ]);

  prompts.instructionRisk = instructionRisk;
  prompts.instructionRec = instructionRec;
  prompts.recommendation = recommendation;
  prompts.risk = risk;

  isInitialized = true;
}
