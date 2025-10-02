export function bboxToString(bbox) {
  // bbox: [minX, minY, maxX, maxY]
  if (!bbox) return null
  const [minX, minY, maxX, maxY] = bbox
  return `${minX.toFixed(4)},${minY.toFixed(4)},${maxX.toFixed(4)},${maxY.toFixed(4)}`
}