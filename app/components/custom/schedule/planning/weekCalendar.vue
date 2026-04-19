<template>
  <div class="calendar-wrapper">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script lang="ts" setup>
import FullCalendar from "@fullcalendar/vue3";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

const { currentDate, getEvents, filteredEvents, getGroupColor } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const calendarRef = ref();

const calendarOptions = {
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: "timeGridWeek",
  firstDay: 1,
  height: "100%",
  nowIndicator: true,
  slotEventOverlap: true,
  allDaySlot: false,
  headerToolbar: false as const,
  dayHeaderContent: (arg: any) => {
    const dayNames = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    const name = dayNames[arg.date.getDay()];
    const date = arg.date.getDate();
    const isWeekend = name === "СБ" || name === "ВС";

    return {
      html: `<div class="custom-day-header ${isWeekend ? "weekend" : ""}">
      <span class="day-name">${name}</span>
      <span class="day-number">${date}</span>
    </div>`,
    };
  },

  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  eventOrder: (a: any, b: any) => {
    const aDur = a.end - a.start;
    const bDur = b.end - b.start;
    return bDur - aDur; // сначала длинные
  },

  events: (_: any, successCallback: any) => {
    successCallback(
      filteredEvents.value.map((event) => ({
        id: String(event.id),
        title: event.group?.name ?? "",
        start: `${format(new Date(event.date), "yyyy-MM-dd")}T${event.startTime}`,
        end: `${format(new Date(event.date), "yyyy-MM-dd")}T${event.endTime}`,
        editable: true,
        backgroundColor: getGroupColor(event.group?.id),
        borderColor: getGroupColor(event.group?.id),
      })),
    );
  },
};

watch(filteredEvents, () => {
  calendarRef.value?.getApi()?.refetchEvents();
});

watch(currentDate, async (date) => {
  await getEvents(date);
  calendarRef.value?.getApi()?.gotoDate(date);
});

await getEvents(currentDate.value);
</script>

<style>
.calendar-wrapper {
  height: 700px;
}

.fc td,
.fc th {
  border-color: #dddfe5;
}

.fc .fc-scrollgrid {
  border-color: #dddfe5;
}

.fc .fc-col-header-cell {
  border-bottom-color: #dddfe5;
}

.fc .fc-timegrid-slot {
  border-color: #dddfe5;
}

/* Убираем бордеры у ячеек времени */
.fc .fc-timegrid-slot-label {
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
}

.fc-scrollgrid-section-header th {
  border-right: 1px solid transparent;
  border-bottom: 2px solid #dddfe5;
}

.fc-scrollgrid-sync-inner {
  border-top: 1px solid transparent;
}
.fc .fc-scrollgrid {
  border: none !important;
}

.fc-timegrid-slot.fc-timegrid-slot-lane.fc-timegrid-slot-minor {
  border-top: 1px solid transparent !important;
}

.fc-timegrid-slot {
  height: 17px !important;
}

.fc-scrollgrid-shrink-cushion {
  font-family: "Nunito";
  font-size: 12px;
  color: #717e97;
  padding-right: 8px !important;
}

.custom-day-header {
  display: flex;
  flex-direction: column;
  font-family: "Nunito-SemiBold";
  font-size: 14px;
  color: #9da4b1;
}

.custom-day-header.weekend {
  color: #eb754c;
}
</style>
