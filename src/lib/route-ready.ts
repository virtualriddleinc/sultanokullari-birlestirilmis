type Listener = (pathname: string) => void;

let currentPathname = "";
const listeners = new Set<Listener>();

export function notifyRouteReady(pathname: string): void {
  if (pathname === currentPathname) return;
  currentPathname = pathname;
  for (const listener of listeners) {
    listener(pathname);
  }
}

export function getCurrentPathname(): string {
  return currentPathname;
}

/**
 * Resolves when `pathname` becomes the active route, or when `timeoutMs` elapses.
 * Returns `true` if the route became ready, `false` on timeout.
 */
export function waitForRoute(
  pathname: string,
  timeoutMs = 2500,
): Promise<boolean> {
  if (currentPathname === pathname) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      listeners.delete(onChange);
      resolve(ready);
    };

    const onChange = (next: string) => {
      if (next === pathname) finish(true);
    };

    listeners.add(onChange);
    const timer = setTimeout(() => finish(false), timeoutMs);
  });
}
