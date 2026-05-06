import { start } from "node:repl";
import { Keyboard } from "vk-io";

export {
  buildStartKeyboard,
  buildBackButton,
  buildKeyboard,
  buildInstructorKeyboard,
  buildKeyboardForMiniApp,
  buildKeyboardForDate,
  buildConfirmKeyboard,
};

async function buildStartKeyboard() {
  const keyboard = Keyboard.builder()
    .textButton({
      label: "Хочу записаться",
      color: Keyboard.POSITIVE_COLOR,
      payload: { cmd: "signup" },
    })
    .row()
    .textButton({
      label: "Войти в систему",
      color: Keyboard.PRIMARY_COLOR,
      payload: { cmd: "login" },
    })
    .oneTime();

  return keyboard;
}

async function buildBackButton() {
  const keyboard = Keyboard.builder().textButton({
    label: "Назад",
    color: Keyboard.POSITIVE_COLOR,
    payload: { cmd: "back" },
  });

  return keyboard;
}

type ListKey = 'city' | 'organization' | 'program' | "venue" | string;

async function buildKeyboard(
  array: string[],
  page: number,
  listKey: ListKey,
) {

  const { slice, currentPage, totalPages } = getPage(array!, page);
  const keyboard = Keyboard.builder().inline();

  for (const element of slice) {
    keyboard
      .callbackButton({
        label: element,
        payload: {
          cmd: "select",
          listKey,
          select: element,
        },
      })
      .row();
  }

  if (totalPages > 1) {
    if (currentPage > 1) {
      keyboard.callbackButton({
        label: "⬅️",
        payload: { cmd: "page", page: currentPage - 1, listKey },
      });
    }

    keyboard.callbackButton({
      label: `${currentPage}/${totalPages}`,
      payload: { cmd: "noop", listKey },
    });

    if (currentPage < totalPages) {
      keyboard.callbackButton({
        label: "➡️",
        payload: { cmd: "page", page: currentPage + 1, listKey },
      });
    }

    keyboard.row();
  }

  keyboard.callbackButton({
    label: "Вернуться",
    payload: { cmd: "back", listKey },
  });

  return keyboard;
}

async function buildInstructorKeyboard(peerId: number) {
  const permission = await getPermission(peerId);
  const keyboard = Keyboard.builder();

  if (permission.changeDate)
    keyboard
      .textButton({
        label: "Перенос даты",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "changeDate" },
      })
      .row();
  else {
    keyboard
      .textButton({
        label: "Запросить перенос даты",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "requestChangeDate" },
      })
      .row();
  }
  if (permission.changeVenue)
    keyboard
      .textButton({
        label: "Замена локации",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "changeVenue" },
      })
      .row();
  else {
    keyboard
      .textButton({
        label: "Запросить замену локации",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "requestChangeVenue" },
      })
      .row();
  }
  if (permission.cancellationLesson)
    keyboard
      .textButton({
        label: "Отмена занятия",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "cancellationLesson" },
      })
      .row();
  else {
    keyboard
      .textButton({
        label: "Запросить отмену занятия",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "cancellationLesson" },
      })
      .row();
  }
  if (permission.changeInstructor)
    keyboard
      .textButton({
        label: "Замена инструктора",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "changeInstructor" },
      })
      .row();

  keyboard.textButton({
    label: "Назад",
    color: Keyboard.POSITIVE_COLOR,
    payload: { cmd: "backToInstructorMenu" },
  });

  return keyboard;
}

async function buildKeyboardForMiniApp(
  peerId: number,
  text: string,
  appId: number,
  ownerId: number,
) {
  return Keyboard.builder()
    .applicationButton({
      label: text,
      appId: appId,
      ownerId: ownerId,
    })
    .textButton({
      label: "Назад",
      color: Keyboard.POSITIVE_COLOR,
      payload: { cmd: "backToScheduleManagement" },
    })
    .row();
}

type Variant = {
  startTime: String,
  endTime: String,
}

type NewOption = {
  date: String,
  variants: Variant[],
}

type NewDateList = {
  lessonId: number,
  newOptions: NewOption[],
}

async function buildKeyboardForDate(page: number, dateList: NewDateList) {
  const lessonId = dateList.lessonId;
  const options = dateList.newOptions;
  const maxPage = options.length - 1;

  const safePage = Math.max(0, Math.min(page, maxPage));
  const currentPage = options[safePage];

  const keyboard = Keyboard.builder().inline();

  for (const element of currentPage!.variants) {
    keyboard
      .callbackButton({
        label: `${element.startTime} - ${element.endTime}`,
        payload: {
          cmd: "selectDate",
          lessonId,
          date: currentPage!.date,
          startTime: element.startTime,
          endTime: element.endTime,
        },
      })
      .row();
  }

  if (safePage > 0) {
    keyboard.callbackButton({
      label: "⬅️",
      payload: { cmd: "pageForDate", page: safePage - 1 },
    });
  }

  keyboard.callbackButton({
    label: `${currentPage!.date}`,
    payload: { cmd: "noop" },
  });

  if (safePage < maxPage) {
    keyboard.callbackButton({
      label: "➡️",
      payload: { cmd: "pageForDate", page: safePage + 1 },
    });
  }

  keyboard.row();

  keyboard.callbackButton({
    label: "Вернуться",
    payload: { cmd: "back", state: "selectDate" },
  });

  return keyboard;
}


async function buildConfirmKeyboard(confirmPayload: {}, denyPayload: {}) {
  const keyboard = Keyboard.builder().inline();

  keyboard.callbackButton({
    label: "Да",
    payload: confirmPayload,
  });

  keyboard.callbackButton({
    label: "нет",
    payload: denyPayload,
  });

  return keyboard;
}