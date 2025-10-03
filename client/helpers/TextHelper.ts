// import "react-phone-number-input/style.css";

import toast from "react-hot-toast";

type FormatDateOptions = {
  useLocalTime?: boolean;
  format?: "DD MMM, YYYY" | "MMM DD, YYYY"; // default "DD MMM, YYYY"
};

type FormatTimeOptions = {
  useLocalTime?: boolean;
};

export class TextHelper {
  static formatNumberWithCommas(numberString: string): string {
    return parseInt(numberString).toLocaleString();
  }

  static capitalize(text: string | undefined) {
    if (!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static getFormattedDate = (
    date: string,
    options: FormatDateOptions = {}
  ): string => {
    const { useLocalTime = true, format = "DD MMM, YYYY" } = options;

    const dateObject = new Date(date);

    // Choose between local or UTC getters
    const day = useLocalTime ? dateObject.getDate() : dateObject.getUTCDate();
    const month = useLocalTime
      ? dateObject.getMonth()
      : dateObject.getUTCMonth();
    const year = useLocalTime
      ? dateObject.getFullYear()
      : dateObject.getUTCFullYear();

    const months = [
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

    // Format day with leading zero if needed
    const dayFormatted = day < 10 ? `0${day}` : `${day}`;
    const monthFormatted = months[month];

    if (format === "MMM DD, YYYY") {
      return `${monthFormatted} ${dayFormatted}, ${year}`;
    }
    // Default "DD MMM, YYYY"
    return `${dayFormatted} ${monthFormatted}, ${year}`;
  };

  static getFormattedTime(dateString: string, options: FormatTimeOptions = {}) {
    const { useLocalTime = true } = options;
    const date = new Date(dateString);

    const hours = useLocalTime ? date.getHours() : date.getUTCHours();
    const minutes = useLocalTime ? date.getMinutes() : date.getUTCMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return (
      formattedHours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm
    );
  }

  static formatTimeInSeconds(sec: number) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  static getTimeMinute(sec: number): number {
    const m = Math.floor(sec / 60);
    return m;
  }

  static convertMinuteToSeconds(min: number): number {
    const seconds = min * 60;
    return seconds;
  }

  static convertSecondsToMinute(sec: number): number {
    const min = sec / 60;
    return min;
  }

  static toUTCISOString(localDateTimeString: string): string {
    const localDate = new Date(localDateTimeString);
    return localDate.toISOString();
  }

  static dateInputToUTC(dateString: string): string {
    const localDate = new Date(dateString);

    if (isNaN(localDate.getTime())) {
      toast.error("Invalid date format");
      throw new Error("Invalid date format");
    }

    return localDate.toISOString();
  }

  static getFormattedDuration(sec: number): string {
    if (sec < 0) {
      throw new Error("Duration cannot be negative");
    }

    const minutes = sec / 60;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
    }
    if (remainingMinutes > 0 || hours === 0) {
      parts.push(`${remainingMinutes} min`);
    }

    return parts.join(" ");
  }

  static truncText(
    text: string | undefined,
    length: number,
    character: string
  ) {
    if (!text) return "";
    if (text.length > length) {
      return text.substring(0, length) + character;
    } else {
      return text;
    }
  }

  static isNumber(text: string) {
    return !/\D/.test(text);
  }

  static isYoutubeUrl(url: string) {
    const youtubeRegex =
      /^((?:https?:)?\/\/)?((?:www\.)?((?:youtube\.com|youtu\.be))\/(?:(embed\/|v\/|watch\?v=|shorts\/)?)([\w-]+)(\S+)?)?$/;

    return youtubeRegex.test(url);
  }

  static containsPhoneNumber(text: string) {
    const phoneRegex =
      /\b(?:\+?(\d{1,3}))?[-. (]*?(\d{3})[-. )]*?(\d{3})[-. ]*(\d{4})\b/g;
    return phoneRegex.test(text);
  }

  static containsNumber(text: string) {
    const numberRegex = /\d/;
    return numberRegex.test(text);
  }

  static containsEmail(text: string) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return emailRegex.test(text);
  }

  static joinText(text: string) {
    return text.replace(" ", "_").trim();
  }

  static removeChar(text: string, char: string) {
    return text.replace(char, " ").trim();
  }

  static setUrl(url: string = "") {
    if (url && url.length > 0 && !url.startsWith("http"))
      return `${
        process.env.NEXT_PUBLIC_AZURE_BLOB_STORAGE_BASE_URL
      }${url.trim()}`;
    return url;
  }

  static FormatAmount(num: number) {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    });
    return formatter.format(num);
  }

  static addSuffix(num: number) {
    if (num % 100 >= 11 && num % 100 <= 13) {
      return num + "th";
    }

    switch (num % 10) {
      case 1:
        return num + "st";
      case 2:
        return num + "nd";
      case 3:
        return num + "rd";
      default:
        return num + "th";
    }
  }

  static getDomainName(url?: string) {
    if (!url) return "";
    return url.replace(/.+\/\/|www.|\..+/g, "");
  }

  static setFilePath(
    basePath: string,
    filePath: string,
    userId: string,
    fileName: string
  ) {
    return (
      basePath.replace("{0}", userId) +
      Date.now() +
      filePath.replace("{1}", fileName)
    );
  }

  static formatTrackerDescriptionText(
    name: string | undefined,
    tracker: string[] | undefined,
    excluded: string[] | undefined
  ) {
    const trackerText = tracker?.length
      ? `includes the keywords: ${tracker.join(", ")}`
      : "includes no keywords";

    const excludedText = excluded?.length
      ? `and excludes the keywords: ${excluded.join(", ")}`
      : "and excludes no keywords";

    return `Tracker "${name}" ${trackerText} ${excludedText}.`;
  }

  static getPasswordStrength(
    password: string
  ): "Weak" | "Medium" | "Strong" | null {
    if (!password) return null;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score === 2 || score === 3) return "Medium";
    if (score >= 4) return "Strong";
    return null;
  }
}
