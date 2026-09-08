const shortPostDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const longPostDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

export const formatShortPostDate = (date: Date) =>
  shortPostDateFormatter.format(date);

export const formatLongPostDate = (date: Date) =>
  longPostDateFormatter.format(date);

export const formatMonthYear = (date: Date) => monthYearFormatter.format(date);
