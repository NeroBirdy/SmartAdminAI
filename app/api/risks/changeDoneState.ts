export const changeDoneState = async (id: number, done: boolean) => {
  await $fetch("/api/risks/changeDoneState", {
    method: "POST",
    body: { id: id, done: done },
  });
};
