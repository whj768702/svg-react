function drawLine(x1: number, y1: number, x2: number, y2: number): SVGLineElement {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1.toString());
  line.setAttribute("y1", y1.toString());
  line.setAttribute("x2", x2.toString());
  line.setAttribute("y2", y2.toString());
  line.setAttribute("stroke", "rgb(255,0,0)");
  return line;
}

function drawBezierCurve(x1: number, y1: number, x2: number, y2: number): SVGGElement {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${x1} ${y1} C ${x1} ${y1} ${x2} ${y2} ${x2} ${y2}`);
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // path.setAttribute('d', "M336.6479187011719,310.8268127441406 C358.4467315673828,310.8268127441406 358.4467315673828,228.64488220214844 380.24554443359375,228.64488220214844");
  path.setAttribute('fill', 'none');
  g.appendChild(path);
  path.setAttribute("stroke", "rgb(255,0,0)");
  return g;
}

export { drawLine, drawBezierCurve };