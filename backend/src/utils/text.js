export const normalizeTextToken = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

export const splitDelimitedText = (value = '') =>
  value
    .split(/[,\n;|]/)
    .map((part) => normalizeTextToken(part))
    .filter(Boolean);

export const uniqueArray = (values = []) => [...new Set(values.filter(Boolean))];

export const truncate = (value = '', maxLength = 2000) => {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}...`;
};
