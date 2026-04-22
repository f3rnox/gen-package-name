export const parseKeywordList = (value: string): string[] =>
  value
    .split(/[\s,]+/)
    .map((keyword: string): string => keyword.trim().toLowerCase())
    .filter((keyword: string): boolean => keyword.length > 0)
