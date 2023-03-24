function calculateOffsets(a: number, b: number) {
  return (a - b) / 10;
}

// get path length
function getPathLength(path: SVGPathElement) {
  return path.getTotalLength();
}

// get path end point
function getPathEndPoint(path: SVGPathElement) {
  const length = getPathLength(path);
  const point = path.getPointAtLength(length);
  return point;
}


export { calculateOffsets, getPathEndPoint, getPathLength };