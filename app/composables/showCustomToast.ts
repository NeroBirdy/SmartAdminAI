import { toast } from "vue-sonner";
import UIToast from "~/components/ui/toast.vue";

export const showCustomToast = (
  type: "success" | "warning" | "danger",
  title: string,
  description: string,
) => {
  toast.custom(
    (t) =>
      h(UIToast, {
        toast: t,
        type: type,
        title: title,
        description: description,
      }),
    {
      duration: type === "danger" ? Infinity : 5000,
    },
  );
};
