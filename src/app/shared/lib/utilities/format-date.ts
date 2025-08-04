import dayjs from "dayjs";

export function formatDate(date?: string) {
  if (!date) return "_";
  return dayjs(date).format("MMMM D, YYYY h:mm A");
}
