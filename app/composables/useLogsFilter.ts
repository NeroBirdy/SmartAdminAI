import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

export const useLogsFilters = () => {
  const choosenCategories = useState<ChangeType[]>(
    "choosen-categories",
    () => [],
  );

  return {
    choosenCategories,
  };
};
