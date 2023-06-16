// Life bar percentage
export function convertToPercentage(
  referenceValue: number,
  currentValue: number
) {
  const percentage = (currentValue / referenceValue) * 100;
  const roundedPercentage = Math.round(percentage);
  const formattedPercentage = `${roundedPercentage}%`.padStart(2, "0");
  return formattedPercentage;
}

// Manhattan distance
export function calculateDistance(x1:number, y1:number, x2:number, y2:number) {
  const distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
  return Math.round(distance);
}
