export const ensureError = (obj: unknown): Error => {
  if (obj instanceof Error) return obj;

  let stringified = '[Unable to stringify the thrown value]';
  try {
    stringified = JSON.stringify(obj);
  } catch {}

  return new Error(
    `This value was thrown as is, not through an Error: ${stringified}`
  );
};
