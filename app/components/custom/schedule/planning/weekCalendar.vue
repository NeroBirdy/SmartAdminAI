<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="time-gutter"></div>
      <div
        class="day-header cal-md"
        v-for="(day, index) in weekDays"
        :key="index"
        :class="{ weekend: index >= 5, today: day.isToday }"
      >
        <span class="day-name">{{ day.name }}</span>
        <span class="day-number">
          {{ day.date.getDate() }}
        </span>
      </div>
    </div>

    <div class="calendar-body">
      <div class="time-column">
        <div class="time-slot" v-for="hour in hours" :key="hour">
          <span class="time-label">{{ formatHour(hour) }}</span>
        </div>
      </div>

      <div class="days-grid">
        <div
          class="day-column"
          v-for="(day, dIndex) in weekDays"
          :key="dIndex"
          :class="{ today: day.isToday }"
        >
          <div class="hour-cell" v-for="hour in hours" :key="hour"></div>

          <div
            class="event"
            v-for="event in getEventsForDay(day.date)"
            :key="event.id"
            :style="getEventStyle(event, weekLayouts[dIndex])"
            :title="event.group?.name"
          >
            <div class="event-inside">
              <p class="event-name">{{ event.group?.name }}</p>
              <p class="event-time">
                {{ event.startTime }} - {{ event.endTime }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isToday, startOfWeek, addDays } from "date-fns";

const { currentDate, getEvents, getEventsForDay, getGroupColor } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const START_HOUR = 5;
const END_HOUR = 24;
const HOUR_HEIGHT = 40;
const DAY_NAMES = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const hours = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);

const weekDays = computed(() => {
  const monday = startOfWeek(currentDate.value, { weekStartsOn: 1 });
  return DAY_NAMES.map((name, i) => {
    const date = addDays(monday, i);
    return { name, date, isToday: isToday(date) };
  });
});

const formatHour = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getColumnLayout = (events: any[]) => {
  const result = new Map<number, { col: number; total: number }>();
  if (!events.length) return result;

  const sorted = [...events].sort((a, b) => {
    const aStart = timeToMinutes(a.startTime);
    const bStart = timeToMinutes(b.startTime);

    if (aStart !== bStart) return aStart - bStart;

    // При одинаковом начале — сначала длинные
    const aDuration = timeToMinutes(a.endTime ?? a.startTime) - aStart;
    const bDuration = timeToMinutes(b.endTime ?? b.startTime) - bStart;

    return bDuration - aDuration;
  });

  const cols: any[][] = [];
  for (const event of sorted) {
    const start = timeToMinutes(event.startTime);
    const end = timeToMinutes(event.endTime ?? event.startTime) || start + 30;

    let placed = false;
    for (const col of cols) {
      const last = col[col.length - 1];
      const lastEnd =
        timeToMinutes(last.endTime ?? last.startTime) ||
        timeToMinutes(last.startTime) + 30;
      if (start >= lastEnd) {
        col.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) cols.push([event]);
  }

  // Назначаем col
  for (let colIdx = 0; colIdx < cols.length; colIdx++) {
    for (const event of cols[colIdx]) {
      result.set(event.id, { col: colIdx, total: 0 }); // total пока 0
    }
  }

  // Считаем максимальный total для каждой группы пересечений
  for (const event of events) {
    const start = timeToMinutes(event.startTime);
    const end = timeToMinutes(event.endTime ?? event.startTime) || start + 30;

    // Все события пересекающиеся с текущим
    const overlapping = events.filter((other) => {
      const oStart = timeToMinutes(other.startTime);
      const oEnd =
        timeToMinutes(other.endTime ?? other.startTime) || oStart + 30;
      return oStart < end && oEnd > start;
    });

    // Максимальная колонка среди пересекающихся
    const maxCol = Math.max(
      ...overlapping.map((e) => result.get(e.id)?.col ?? 0),
    );
    const total = maxCol + 1;

    // Обновляем total для всех пересекающихся
    for (const other of overlapping) {
      const existing = result.get(other.id)!;
      result.set(other.id, {
        ...existing,
        total: Math.max(existing.total, total),
      });
    }
  }

  return result;
};

const getEventStyle = (
  event: any,
  layout: Map<number, { col: number; total: number }>,
) => {
  const startMinutes = timeToMinutes(event.startTime);
  const endMinutes = timeToMinutes(event.endTime ?? event.startTime);
  const offsetMinutes = startMinutes - START_HOUR * 60;
  const duration = Math.max(endMinutes - startMinutes, 30);

  const { col, total } = layout.get(event.id) ?? { col: 0, total: 1 };
  const width = 100 / total;

  return {
    top: `${(offsetMinutes / 60) * HOUR_HEIGHT}px`,
    height: `${(duration / 60) * HOUR_HEIGHT - 2}px`,
    left: col === 0 ? `2px` : `calc(${col * width}% - ${col * 2}px)`,
    width: `calc(${width}% - 2px)`,
    zIndex: col + 1,
    backgroundColor: getGroupColor(event.group?.id),
  };
};

const weekLayouts = computed(() =>
  weekDays.value.map((day) => getColumnLayout(getEventsForDay(day.date))),
);

const updateCalendar = async () => {
  await getEvents(currentDate.value);
};

updateCalendar();
watch(currentDate, updateCalendar);
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  border-bottom: 1px solid #e9eaec;
  padding-bottom: 8px;
}

.day-header {
  text-align: center;
  color: #9da4b1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.day-header.weekend .day-name {
  color: #eb754c;
}

.day-header.weekend .day-number {
  color: #eb754c;
}

.day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: 500;
}

.day-number.today {
  background-color: #3a8aef;
  color: white;
}

.calendar-body {
  display: flex;
  flex-direction: row;
  overflow: hidden; /* убираем скролл */
  flex: 1;
}

.time-column {
  width: 60px;
  flex-shrink: 0;
}

.time-slot {
  height: 40px;
  display: flex;
  align-items: center; /* было flex-start */
  justify-content: flex-end;
  padding-right: 8px;
  box-sizing: border-box;
}

.time-label {
  color: #9da4b1;
  font-size: 11px;
  /* убери transform: translateY(-8px); */
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
  border-left: 1px solid #e9eaec;
}

.day-column {
  position: relative;
  border-right: 1px solid #e9eaec;
}

.hour-cell {
  height: 40px;
  border-bottom: 1px solid #f0f1f3;
  box-sizing: border-box;
}

.event {
  position: absolute;
  border-radius: 6px;
  /* padding: 4px 6px; */
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.15s;
}

.event-name {
  color: white;
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-time {
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  margin: 0;
  white-space: nowrap;
}

.event-inside {
  padding: 4px 6px;
}
</style>
