import { getAssetKeys } from "node:sea";
import { Keyboard } from "vk-io";

export {
  buildStartKeyboard,
  buildBackButton,
  buildKeyboard,
  buildInstructorKeyboard,
  buildKeyboardForMiniApp,
  buildKeyboardForDate,
  buildConfirmKeyboard,
  buildKeyboardForTrialLesson,
  buildKeyboardForGroup,
  buildMainMenuKeyboard,
};

async function buildStartKeyboard(peerId: number) {
  const keyboard = Keyboard.builder()

  const orgId = await getOrgByPeerId(peerId);
  const enabledModules = await getEnabledModules(orgId!);
  console.log(enabledModules);

  if (enabledModules.customerSupport) {
    keyboard.textButton({
      label: "Хочу записаться",
      color: Keyboard.POSITIVE_COLOR,
      payload: { cmd: "signup" },
    }).row()
  }

  keyboard.textButton({
    label: "Войти в систему",
    color: Keyboard.PRIMARY_COLOR,
    payload: { cmd: "login" },
  }).oneTime();

  return keyboard;
}

async function buildMainMenuKeyboard() {
  const keyboard = Keyboard.builder().textButton({ label: "Вернуться к выбору программы", payload: { cmd: "returnChooseProgram" } })
  return keyboard
}

async function buildBackButton() {
  const keyboard = Keyboard.builder().textButton({
    label: "Назад",
    color: Keyboard.POSITIVE_COLOR,
    payload: { cmd: "back" },
  });

  return keyboard;
}

type ListKey = "city" | "organization" | "program" | "venue" | string;

async function buildKeyboard(array: string[], page: number, listKey: ListKey, venueId?: number, venueCmd?: string) {
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
          oldVenueId: listKey === "venue" ? venueId : 0,
          venueCmd: listKey === "venue" ? venueCmd : "",
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
  const role = await getUserRole(peerId);

  let permission;
  if (role === "MANAGER") {
    permission = {
      changeDate: true,
      changeVenue: true,
      cancellationLesson: true,
      changeInstructor: true,
    };
  } else {
    permission = await getPermission(peerId);
  }

  const orgId = await getOrgByPeerId(peerId);
  const enabledModules = await getEnabledModules(orgId!);

  const keyboard = Keyboard.builder();

  if (enabledModules.scheduleManagement) {
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
  }

  if (enabledModules.personnelCoordination)
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
  startTime: String;
  endTime: String;
};

type NewOption = {
  date: String;
  variants: Variant[];
};

type NewDateList = {
  lessonId: number;
  newOptions: NewOption[];
};

async function buildKeyboardForDate(page: number, dateList: NewDateList, cmd: string, oldLessonId: number) {
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
          cmd: cmd,
          oldLessonId: oldLessonId,
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
      payload: { cmd: "pageForDate", page: safePage - 1, dateCmd: cmd, oldLessonId: oldLessonId },
    });
  }

  keyboard.callbackButton({
    label: `${currentPage!.date}`,
    payload: { cmd: "noop" },
  });

  if (safePage < maxPage) {
    keyboard.callbackButton({
      label: "➡️",
      payload: { cmd: "pageForDate", page: safePage + 1, dateCmd: cmd, oldLessonId: oldLessonId },
    });
  }

  keyboard.row();

  keyboard.callbackButton({
    label: "Вернуться",
    payload: { cmd: "backToScheduleManagement", state: "selectDate" },
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

type TrialLesson = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  groupId: number;
  instructorId: number;
  programId: number;
  venueId: number;
  employeeProgramId: number;
};

type TrialDate = {
  date: string;
  lessons: TrialLesson[];
};

async function buildKeyboardForTrialLesson(
  trialLessonList: TrialDate[],
  page: number,
) {
  const maxPage = trialLessonList.length - 1;
  const safePage = Math.max(0, Math.min(page, maxPage));

  const currentPage = trialLessonList[safePage];
  const date = currentPage?.date.split("T")[0];

  const keyboard = Keyboard.builder().inline();

  for (const lesson of currentPage?.lessons!) {
    keyboard
      .callbackButton({
        label: `${timeFromIsoToLocalHm(lesson.startTime)} - ${timeFromIsoToLocalHm(lesson.endTime)}`,
        payload: {
          cmd: "selectTrialLesson",
          lessonId: lesson.id,
          date: date,
          startTime: timeFromIsoToLocalHm(lesson.startTime),
          endTime: timeFromIsoToLocalHm(lesson.endTime),
          groupId: lesson.groupId,
          instructorId: lesson.instructorId,
          programId: lesson.programId,
          venueId: lesson.venueId,
          employeeProgramId: lesson.employeeProgramId,
        },
      })
      .row();
  }

  if (safePage > 0) {
    keyboard.callbackButton({
      label: "⬅️",
      payload: { cmd: "pageForTrialLesson", page: safePage - 1 },
    });
  }

  keyboard.callbackButton({
    label: `${date}`,
    payload: { cmd: "noop" },
  });

  if (safePage < maxPage) {
    keyboard.callbackButton({
      label: "➡️",
      payload: { cmd: "pageForTrialLesson", page: safePage + 1 },
    });
  }

  keyboard.row();

  keyboard.callbackButton({
    label: "Вернуться",
    payload: { cmd: "back", listKey: "trialLesson" },
  });

  return keyboard;
}

type Group = {
  id: number;
  name: string;
};

async function buildKeyboardForGroup(groupsList: Group[], page: number) {
  const maxPageSize = 3;

  const total = groupsList.length;
  const totalPages = Math.max(1, Math.ceil(total / maxPageSize));

  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * maxPageSize;
  const end = start + maxPageSize;
  const slice = groupsList.slice(start, end);

  const keyboard = Keyboard.builder().inline();

  for (const group of slice) {
    keyboard
      .callbackButton({
        label: group.name,
        payload: {
          cmd: "selectGroup",
          groupId: group.id,
          groupName: group.name,
        },
      })
      .row();
  }

  if (totalPages > 1) {
    if (currentPage > 1) {
      keyboard.callbackButton({
        label: "⬅️",
        payload: {
          cmd: "pageGroup",
          page: currentPage - 1,
        },
      });
    }

    keyboard.callbackButton({
      label: `${currentPage}/${totalPages}`,
      payload: {
        cmd: "noop_group",
      },
    });

    if (currentPage < totalPages) {
      keyboard.callbackButton({
        label: "➡️",
        payload: {
          cmd: "pageGroup",
          page: currentPage + 1,
        },
      });
    }

    keyboard.row();
  }

  return keyboard;
}