export const sample = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)]
