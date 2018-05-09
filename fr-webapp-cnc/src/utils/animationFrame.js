const win = window;
const reqpolyfill = callback => win.setTimeout(callback, 1000 / 60);
const cancelpolyfill = id => clearTimeout(id);

const requestAnimationFrame = win.requestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.msRequestAnimationFrame ||
  reqpolyfill;

const cancelAnimationFrame = win.cancelAnimationFrame ||
  win.mozCancelAnimationFrame || cancelpolyfill;

export {
  requestAnimationFrame,
  cancelAnimationFrame,
};
