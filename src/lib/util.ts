export const customParseInt = (value: string | number | string[] | undefined): number => {
  let int = parseInt(value ? value.toString() : "")
  return isNaN(int) ? 0 : int
}