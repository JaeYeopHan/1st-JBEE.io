const ROOT_ID = '#___gatsby'
export const TARGET_CLASS = 'observed'
const VISIBLE_RECOGNIZE_CLASS = 'visible'
const INTERSECTION_OBSERVER_ROOT_MARGIN = '20px'
const INTERSECTION_OBSERVER_THRESHOLD = 0.8

function observeCallback(entries) {
  entries
    .filter(({ isIntersecting }) => isIntersecting)
    .map(({ target }) => target.classList.add(VISIBLE_RECOGNIZE_CLASS))
}

function observerTargeting(observer) {
  document
    .querySelectorAll(`.${TARGET_CLASS}`)
    .forEach(target => observer.observe(target))
}

export function init() {
  const observer = new IntersectionObserver(observeCallback, {
    root: document.querySelector(ROOT_ID),
    rootMargin: INTERSECTION_OBSERVER_ROOT_MARGIN,
    threshold: INTERSECTION_OBSERVER_THRESHOLD,
  })

  observerTargeting(observer)

  window.refreshObserver = function() {
    observer.disconnect()
    observerTargeting(observer)
  }
}
