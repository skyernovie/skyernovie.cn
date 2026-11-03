/*
 * 像素图标：16×16 网格里用方块拼出来的小图标，shapeRendering="crispEdges" 保证边缘不发虚。
 * 方块类图标用固定色（草绿/钻石青/金/红石），线性小图标用 currentColor，跟随主题。
 */

const BRICKS = {
  grass: [
    [0, 5, 16, 11, '#7b5433'],
    [3, 9, 2, 2, '#6a4526'],
    [10, 11, 3, 2, '#8f6640'],
    [0, 2, 16, 4, '#5fd068'],
    [0, 2, 16, 1, '#8ef1a0'],
    [0, 5, 16, 1, '#3f9448'],
  ],
  diamond: [
    [6, 1, 4, 2, '#4fe0d0'],
    [4, 3, 8, 2, '#4fe0d0'],
    [2, 5, 12, 2, '#66eade'],
    [4, 7, 8, 2, '#4fe0d0'],
    [6, 9, 4, 2, '#2fbcae'],
    [5, 3, 3, 2, '#b7f8f2'],
  ],
  gold: [
    [2, 5, 12, 6, '#f5c542'],
    [4, 4, 8, 2, '#ffdf7a'],
    [2, 9, 12, 2, '#d9a72b'],
    [5, 6, 3, 2, '#fff2c4'],
  ],
  redstone: [
    [7, 7, 2, 8, '#8b5e37'],
    [6, 2, 4, 5, '#e05b4a'],
    [7, 3, 2, 3, '#ff9a8a'],
    [6, 13, 4, 2, '#6a4526'],
  ],
  craft: [
    [1, 3, 14, 11, '#9c6b3f'],
    [1, 3, 14, 2, '#b8814c'],
    [1, 5, 14, 1, '#6b4727'],
    [5, 6, 1, 8, '#6b4727'],
    [10, 6, 1, 8, '#6b4727'],
    [1, 10, 14, 1, '#6b4727'],
  ],
  sign: [
    [7, 9, 2, 6, '#7b5433'],
    [1, 3, 14, 7, '#b8814c'],
    [1, 3, 14, 1, '#d29a63'],
    [3, 5, 9, 1, '#6b4727'],
    [3, 7, 6, 1, '#6b4727'],
  ],
  bed: [
    [1, 6, 14, 8, '#e05b4a'],
    [1, 6, 14, 3, '#f3f4f6'],
    [12, 8, 3, 5, '#c0392b'],
    [3, 9, 4, 3, '#f9a8a0'],
  ],
}

const STROKES = {
  play: [
    [4, 3, 3, 10],
    [7, 5, 3, 6],
    [10, 7, 2, 2],
  ],
  user: [
    [5, 2, 6, 5],
    [3, 9, 10, 5],
  ],
  clock: [
    [5, 2, 6, 1],
    [3, 4, 2, 2],
    [11, 4, 2, 2],
    [3, 10, 2, 2],
    [11, 10, 2, 2],
    [5, 13, 6, 1],
    [7, 5, 2, 4],
    [9, 8, 3, 2],
  ],
  spark: [
    [7, 2, 2, 12],
    [2, 7, 12, 2],
  ],
  arrow: [
    [7, 3, 2, 9],
    [4, 8, 2, 2],
    [6, 10, 2, 2],
    [8, 8, 2, 2],
    [10, 6, 2, 2],
  ],
}

export default function PixelIcon({ name, size = 16, className = '', title }) {
  const bricks = BRICKS[name];
  const strokes = STROKES[name];

  if (!bricks && !strokes) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {bricks &&
        bricks.map(([x, y, w, h, fill], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
        ))}
      {strokes &&
        strokes.map(([x, y, w, h], i) => (
          <rect key={`s${i}`} x={x} y={y} width={w} height={h} fill="currentColor" />
        ))}
    </svg>
  )
}
