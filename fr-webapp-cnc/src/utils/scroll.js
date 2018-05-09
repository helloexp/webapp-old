import { requestAnimationFrame } from 'utils/animationFrame';
import events from 'utils/events';

let currentTime;
let scrollDuration;
let element;

function easeInOut(now, distance, changesInValue, duration) {
  let time = now / (duration / 2);

  if (time < 1) {
    return changesInValue / 2 * time * time + distance;
  }

  time--;

  return -changesInValue / 2 * (time * (time - 2) - 1) + distance;
}

function scroll(distance, changesInValue) {
  const increment = 10;

  currentTime += increment;
  element.scrollTop = easeInOut(currentTime, distance, changesInValue, scrollDuration);

  if (currentTime < scrollDuration) {
    setTimeout(() => requestAnimationFrame(() => scroll(distance, changesInValue)), increment);
  }
}

function scrollToTop(elem, toPosition, duration = 500) {
  element = elem;
  currentTime = 0;
  scrollDuration = duration;

  const distance = element.scrollTop - toPosition;
  const changesInValue = toPosition - distance;

  scroll(distance, changesInValue);
}

function scrollElmIntoView(elem, options = {}) {
  if (elem) {
    setTimeout(() => elem.scrollIntoView(options), 0);
  }
}

function scrollToPosition(yPos = 0, xPos = 0) {
  setTimeout(() => window.scrollTo(yPos, xPos), 10);
}

function getScrollPosition() {
  return (
    // window.scrollY
    window.pageYOffset ||
    // <html>.scrollTop
    document.documentElement.scrollTop ||
    // document.body.scrollTop
    events.getContentScroll() ||
    0
  );
}

export default () => scrollToTop(document.body, 0, 500);

export {
  scrollToTop,
  scrollElmIntoView,
  scrollToPosition,
  getScrollPosition,
};
