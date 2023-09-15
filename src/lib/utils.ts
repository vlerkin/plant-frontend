import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getUser } from "./userApi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAuthUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  } else {
    try {
      const response = await getUser();
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export const numberToMonth = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function dateFormat(date_string: string) {
  const date = new Date(
    date_string[date_string.length - 1] === "Z"
      ? date_string
      : date_string + "Z"
  );
  return numberToMonth[date.getMonth()] + " " + date.getDate();
}

export const MAX_FILE_SIZE = 10000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
