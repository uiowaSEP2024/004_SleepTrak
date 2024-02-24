import { ensureError } from '../utils/error.js';

type AsyncControllerFn = (...args: any[]) => Promise<void>;

export const asyncHandler = (fn: AsyncControllerFn) => {
  return (...args: any[]) => {
    Promise.resolve(fn(...args))
      .catch(args[args.length - 1])
      .catch((err) => {
        throw ensureError(err);
      });
  };
};
