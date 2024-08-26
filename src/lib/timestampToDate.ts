export function timestampToDate(value) {
  if (!value) return null;
  return new Date(value.seconds * 1000);
}
