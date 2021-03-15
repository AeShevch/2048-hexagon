export const generateInitialBoardData = (level) => {
  const results = [];
  const n = level - 1;

  for (let x = -n; x <= n; x++) {
    for (let y = Math.max(-n, -x - n); y <= Math.min(n, -x + n); y++) {
      const z = -x - y;
      results.push({ x, y, z, value: 0 });
    }
  }

  return results;
};
