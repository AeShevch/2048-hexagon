const Cell = ({x, y, z, value, width, height}) => {

  const cellShiftVertical = (z + x / 2) * height;
  const cellShiftHorizontal = x * width * 3 / 4;

  return (
    <div
      className="board__cell"
      aria-label={`Game cell – x:${x}, y: ${y}, z: ${z}, value: ${value}`}
      data-x={x} data-y={y} data-z={z}
      data-value={value}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        // Сдвиг от центра доски
        transform: `translateY(${cellShiftVertical}px) translateX(${cellShiftHorizontal}px)`
      }}
    >
      {value}
    </div>
  )
}

export default Cell;
