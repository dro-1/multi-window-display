export const viewportWidth = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
export const viewportHeight = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

export const addPosition = (posInfo: {
  x: number;
  y: number;
  id: number;
  screenX: number;
  screenY: number;
}) => {
  const { id } = posInfo;
  const storedPositions = localStorage.getItem("positions");
  const positionsObj = storedPositions ? JSON.parse(storedPositions) : {};
  positionsObj[id] = posInfo;
  localStorage.setItem("positions", JSON.stringify(positionsObj));
};

export const getPositions = (): {
  [key: number]: {
    id: number;
    screenX: number;
    screenY: number;
    x: number;
    y: number;
  };
} => {
  const storedPositions = localStorage.getItem("positions");
  if (!storedPositions) return {};
  return JSON.parse(storedPositions);
};

let selectedId = 0;

export const getId = () => {
  if (selectedId) return selectedId;
  const storedUids = localStorage.getItem("uids");
  const ids: number[] = storedUids ? JSON.parse(storedUids) : [];
  const id = ids.length + 1;
  ids.push(id);
  localStorage.setItem("uids", JSON.stringify(ids));
  selectedId = id;
  return id;
};

export const deleteId = (id: number) => {
  const storedUids = localStorage.getItem("uids");
  let ids: number[] = storedUids ? JSON.parse(storedUids) : [];
  if (id in ids) {
    ids = ids.filter((id) => id != id);
    localStorage.setItem("uids", JSON.stringify(ids));
  }

  const storedPositions = localStorage.getItem("positions");
  const positionsObj = storedPositions ? JSON.parse(storedPositions) : {};
  if (id in positionsObj) {
    delete positionsObj[id];
    localStorage.setItem("positions", JSON.stringify(positionsObj));
  }
};
