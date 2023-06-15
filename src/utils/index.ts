export function convertToPercentage(
  referenceValue: number,
  currentValue: number
) {
  const percentage = (currentValue / referenceValue) * 100;
  const roundedPercentage = Math.round(percentage);
  const formattedPercentage = `${roundedPercentage}%`.padStart(2, "0");
  return formattedPercentage;
}
