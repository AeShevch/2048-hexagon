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

const keyCodeToAxis = {
  "KeyQ": {
    name: "z",
    direction: "start"
  },
  "KeyW": {
    name: "x",
    direction: "start"
  },
  "KeyE": {
    name: "y",
    direction: "start"
  },
  "KeyA": {
    name: "y",
    direction: "end"
  },
  "KeyS": {
    name: "x",
    direction: "end"
  },
  "KeyD": {
    name: "z",
    direction: "end"
  },
};

const getKeyInfo = (keyCode) => Object.values(keyCodeToAxis[keyCode]);

export const isControlKey = (keyCode, action) => {
  if (Object.keys(keyCodeToAxis).includes(keyCode)) {
    action(...getKeyInfo(keyCode));
  }
};
