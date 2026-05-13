import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

export const useLogsFilters = () => {
  const choosenCategories = useState<ChangeType[]>(
    "choosen-categories",
    () => [],
  );

  const categoryFilterOpen = useState("logs-category-filter-open", () => false);

  const dateFilterOpen = useState("logs-date-filter-open", () => false);

  const currentDate = useState("logs-currentDate", () => new Date());

  const selectedStart = useState<Date | null>(
    "logs-selected-start",
    () => null,
  );
  const selectedEnd = useState<Date | null>("logs-selected-end", () => null);
  const startDate = useState<Date | null>("logs-start-date", () => null);
  const endDate = useState<Date | null>("logs-end-date", () => null);

  const hasError = useState<boolean>("logs-has-error", () => false);

  return {
    choosenCategories,
    categoryFilterOpen,
    dateFilterOpen,
    currentDate,
    selectedStart,
    selectedEnd,
    startDate,
    endDate,
    hasError
  };
};
