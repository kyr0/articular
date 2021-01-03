export const debounce = <T>(fn: Function, ms: number): T => {
  let timeout: any;

  return function () {
    const delegate = () => fn.apply(
      // @ts-ignore
      this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(delegate, ms);
  } as unknown as T;
}