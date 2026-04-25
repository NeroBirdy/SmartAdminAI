import { Keyboard } from "vk-io";

export {
  buildKeyboard,
  buildInstructorKeyboard,
  buildKeyboardForMiniApp,
};

async function buildKeyboard(
  peerId: number,
  page: number,
  currentState: string,
) {
  const array = await getListFromState(peerId, currentState);

  const { slice, currentPage, totalPages } = getPage(array!, page);
  const keyboard = Keyboard.builder().inline();

  for (const element of slice) {
    keyboard
      .callbackButton({
        label: element,
        payload: {
          cmd: currentState,
          select: element,
        },
      })
      .row();
  }

  if (totalPages > 1) {
    if (currentPage > 1) {
      keyboard.callbackButton({
        label: "⬅️",
        payload: { cmd: "page", page: currentPage - 1 },
      });
    }

    keyboard.callbackButton({
      label: `${currentPage}/${totalPages}`,
      payload: { cmd: "noop" },
    });

    if (currentPage < totalPages) {
      keyboard.callbackButton({
        label: "➡️",
        payload: { cmd: "page", page: currentPage + 1 },
      });
    }

    keyboard.row();
  }

  keyboard.callbackButton({
    label: "Вернуться",
    payload: { cmd: "back", state: currentState },
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
  if (permission.changeVenue)
    keyboard
      .textButton({
        label: "Замена локации",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "changeVenue" },
      })
      .row();
  if (permission.cancellationLesson)
    keyboard
      .textButton({
        label: "Отмена занятия",
        color: Keyboard.PRIMARY_COLOR,
        payload: { cmd: "cancellationLesson" },
      })
      .row();
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
      payload: { cmd: "back" },
    })
    .row();
}
