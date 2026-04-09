export const useSchedule = () => {
  type lesson = {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
    group: {
      id: number;
      name: string;
    };
    venue: {
      id: number;
      name: string;
    };
  };

  const groupColors = computed(() => generateGroupColors(groups.value.length));

  const currentDate = ref(new Date());
  const events = ref<lesson[]>([]);

  const groups = ref<{ id: number; name: string }[]>([]);
  const venues = ref<{ id: number; name: string }[]>([]);

  const selectedGroups = ref<number[]>([]);
  const selectedVenues = ref<number[]>([]);

  const filteredEvents = computed(() => {
    return events.value.filter((event) => {
      const groupMatch = selectedGroups.value.includes(event.group.id);
      const placeMatch = selectedVenues.value.includes(event.venue.id);
      return groupMatch && placeMatch;
    });
  });

  const generateGroupColors = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = (200 + (i * 360) / count) % 360;
      return `hsl(${hue}, 70%, 55%)`;
    });
  };

  const getGroupColor = (groupId: number) => {
    const index = groups.value.findIndex((g) => g.id === groupId);
    return groupColors.value[index] ?? "#3a8aef";
  };

  const getEvents = async (date: Date) => {
    try {
      const response = await $fetch<lesson[]>("/api/schedule/getSchedule", {
        method: "POST",
        body: { orgId: 1, date },
      });
      events.value = response;

      if (groups.value.length === 0) {
        const uniqueGroups = new Map(
          response.map((e) => [e.group.id, e.group]),
        );

        groups.value = [...uniqueGroups.values()];
        selectedGroups.value = [...uniqueGroups.keys()];
      }
      if (venues.value.length === 0) {
        const uniqueVenues = new Map(
          response.map((e) => [e.venue.id, e.venue]),
        );

        venues.value = [...uniqueVenues.values()];
        selectedVenues.value = [...uniqueVenues.keys()];
      }
    } catch (error) {
      console.error("Ошибка получения расписания:", error);
    }
  };

  const getEventsForDay = (date: Date) => {
    return filteredEvents.value.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return {
    currentDate,
    events,
    groups,
    venues,
    filteredEvents,
    selectedGroups,
    selectedVenues,
    getEvents,
    getEventsForDay,
    getGroupColor
  };
};
