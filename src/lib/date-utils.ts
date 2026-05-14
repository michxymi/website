const shortPostDateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const longPostDateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const recentPostDateFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  day: "numeric",
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

export const formatRecentPostDate = (date: Date) =>
  recentPostDateFormatter.format(date);

export const formatMonthYear = (date: Date) => monthYearFormatter.format(date);
