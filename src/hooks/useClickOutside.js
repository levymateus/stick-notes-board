import { useEventListener } from "./useEventListener";

export const useOnClickOutside = (
  ref,
  callback,
) => {
  useEventListener(
    'mousedown',
    (event) => {
      const target = event.target;

      if (!target || !target.isConnected) {
        return;
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter((r) => Boolean(r.current))
            .every((r) => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target);

      if (isOutside) callback(event);
    },
  );
};
