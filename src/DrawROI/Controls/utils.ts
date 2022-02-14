export function getRandomId(): number {
  const min = 99
  const max = 999999
  const random = Math.floor(Math.random() * (max - min + 1)) + min
  return new Date().getTime() + random
}
