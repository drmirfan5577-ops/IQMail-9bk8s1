// Hijri (Islamic) Calendar utility
const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

export function toHijri(date: Date): { day: number; month: string; monthNum: number; year: number } {
  const jd = Math.floor((14 + date.getMonth() + 1) / 12);
  const y = date.getFullYear() + 4800 - jd;
  const m = date.getMonth() + 1 + 12 * jd - 3;
  let julianDay = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Convert Julian Day to Hijri
  const l = julianDay - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remaining = l - 10631 * n + 354;
  const j = Math.floor((10985 - remaining) / 5316) * Math.floor((50 * remaining) / 17719) +
    Math.floor(remaining / 5670) * Math.floor((43 * remaining) / 15238);
  const remaining2 = remaining - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * remaining2) / 709);
  const day = remaining2 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return {
    day,
    month: HIJRI_MONTHS[month - 1] || HIJRI_MONTHS[0],
    monthNum: month,
    year,
  };
}

export function formatHijriDate(date: Date): string {
  const h = toHijri(date);
  return `${h.day} ${h.month} ${h.year} AH`;
}
