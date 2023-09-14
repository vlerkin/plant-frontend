import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAuthUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  } else {
    try {
      const response = await axios.get("http://localhost:8000/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  const date = new Date(date_string + "Z");
  return numberToMonth[date.getMonth()] + " " + date.getDate();
}

export const MAX_FILE_SIZE = 10000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
