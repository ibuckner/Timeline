/**
 * DOM helper for selecting a node
 * @param container - this can be a DOM node or standard CSS selector string
 */
export function select(container: HTMLElement | string): HTMLElement {
  let el;
  if (typeof container === "string") {
    el = document.getElementById(container);
    if (el === null) {
      el = document.querySelector(container) as HTMLElement;
    }
    if (el === null) {
      throw new Error("Failed to resolve parent container");
    }
  } else {
    el = container;
  }
  return el;
}