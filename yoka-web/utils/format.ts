const formatRoundTime = (startStr: string, endStr: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok", // บังคับให้เป็นเวลาไทย
  };

  const start = new Intl.DateTimeFormat("th-TH", options).format(
    new Date(startStr)
  );
  const end = new Intl.DateTimeFormat("th-TH", options).format(
    new Date(endStr)
  );

  return `${start} - ${end} น.`;
};

const formatRoundEnglish = (startStr: string, endStr: string) => {
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  // 1. จัดการวันที่: Saturday, 18 May 2024
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(startDate);

  // 2. จัดการเวลา: 09:00 - 10:30
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  };

  const startTime = new Intl.DateTimeFormat("en-GB", timeOptions).format(
    startDate
  );
  const endTime = new Intl.DateTimeFormat("en-GB", timeOptions).format(endDate);

  return {
    dateLabel, // "Saturday, 13 Dec 2025"
    timeLabel: `${startTime} - ${endTime}`, // "08:36 - 08:36"
  };
};

export { formatRoundTime, formatRoundEnglish };
