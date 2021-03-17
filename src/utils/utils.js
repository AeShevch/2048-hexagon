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
    direction: "y"
  },
  "KeyW": {
    name: "x",
    direction: "y"
  },
  "KeyE": {
    name: "y",
    direction: "x"
  },
  "KeyA": {
    name: "y",
    direction: "z"
  },
  "KeyS": {
    name: "x",
    direction: "z"
  },
  "KeyD": {
    name: "z",
    direction: "x"
  },
};

const getKeyInfo = (keyCode) => Object.values(keyCodeToAxis[keyCode]);

export const isControlKey = (keyCode, action) => {
  if (Object.keys(keyCodeToAxis).includes(keyCode)) {
    action(...getKeyInfo(keyCode));
  }
};
