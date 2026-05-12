import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

export const useLogsFilters = () => {
  const choosenCategories = useState<ChangeType[]>(
    "choosen-categories",
    () => [],
  );

  const categoryFilterOpen = useState(
    "category-filter-open",
    () => false,
  );

  const dateFilterOpen = useState(
    "date-filter-open",
    () => false,
  );

  return {
    choosenCategories,
    categoryFilterOpen,
    dateFilterOpen,
  };
};