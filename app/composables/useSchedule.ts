import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { getSchedule } from "~/api/getSchedule";

export const useSchedule = () => {
  type group = {
    id: number;
    name: string;
    color: string;
  };

  type venue = {
    id: number;
    name: string;
  };

  type lesson = {
    id: string;
    startTime: string;
    endTime: string;
    color: string;
    group: group;
    venue: venue;
  };

  const expandedDate = ref<Date | null>(null);

  const currentDate = ref(new Date());

  const dateFrom = computed(() =>
    startOfWeek(startOfMonth(currentDate.value), { weekStartsOn: 1 }),
  );
  const dateTo = computed(() =>
    endOfWeek(endOfMonth(currentDate.value), { weekStartsOn: 1 }),
  );

  const selectedGroups = ref<number[]>([]);
  const selectedVenues = ref<number[]>([]);

  const schedule = ref<Record<string, lesson[]>>({});
  const venues = ref<venue[]>([]);
  const groups = ref<group[]>([]);

  const syncSelected = (
    newItems: { id: number }[],
    selected: Ref<number[]>,
  ) => {
    if (!newItems.length) return;
    const newIds = newItems.map((i) => i.id);
    isUpdating = true;
    selected.value = selected.value.filter((id) => newIds.includes(id));
    const toAdd = newIds.filter((id) => !selected.value.includes(id));
    selected.value.push(...toAdd);
    nextTick(() => {
      isUpdating = false;
    });
  };

  const getExceptions = (items: { id: number }[], selected: number[]) =>
    items.filter((i) => !selected.includes(i.id)).map((i) => i.id);

  const fetchSchedule = async () => {
    const groupExceptions = getExceptions(groups.value, selectedGroups.value);
    const venueExceptions = getExceptions(venues.value, selectedVenues.value);

    return getSchedule({
      orgId: 1,
      dateFrom: dateFrom.value.toISOString(),
      dateTo: dateTo.value.toISOString(),
      groupExceptions,
      venueExceptions,
    });
  };

  const { data, refresh } = useAsyncData("schedule-data", fetchSchedule, {
    watch: [dateFrom, dateTo],
  });

  let isUpdating = false;

  watch(data, (newData) => {
    if (!newData) return;
    schedule.value = newData.lessons || {};
    if (newData.groups?.length !== groups.value.length)
      groups.value = newData.groups;
    if (newData.venues?.length !== venues.value.length)
      venues.value = newData.venues;
  });

  watch(groups, (newGroups) => syncSelected(newGroups, selectedGroups));
  watch(venues, (newVenues) => syncSelected(newVenues, selectedVenues));

  watch(
    [selectedGroups, selectedVenues],
    () => {
      if (!isUpdating) refresh();
    },
    { deep: true },
  );

  return {
    expandedDate,
    currentDate,
    schedule,
    groups,
    venues,
    selectedGroups,
    selectedVenues,
  };
};
