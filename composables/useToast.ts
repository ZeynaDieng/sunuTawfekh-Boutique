const TOAST_LIMIT = 1;

export type ToastVariant = "default" | "destructive";

export interface AppToast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

export function useToast() {
  const toasts = useState<AppToast[]>("app-toast-list", () => []);

  function toast(payload: Omit<AppToast, "id">) {
    const id = genId();
    const next = [{ id, ...payload }, ...toasts.value].slice(0, TOAST_LIMIT);
    toasts.value = next;
    return {
      id,
      dismiss: () => dismiss(id),
    };
  }

  function dismiss(toastId?: string) {
    if (toastId === undefined) {
      toasts.value = [];
      return;
    }
    toasts.value = toasts.value.filter((t) => t.id !== toastId);
  }

  return {
    toasts,
    toast,
    dismiss,
  };
}
