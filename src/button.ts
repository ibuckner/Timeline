import { select } from "./select";

class Button {
  public element: HTMLElement;

  constructor(selector: HTMLElement | string) {
    this.element = select(selector);
  }

  public hide(): Button {
    this.element.classList.add("hidden");
    return this;
  }

  /**
   * Responds to indirect events
   * @param eventName - DOM event name
   * @param cb - function to call
   */
  public indirect(eventName: string, cb: Function): Button {
    window.addEventListener(eventName, (event) => cb.call(this, event));
    return this;
  }

  /**
   * Responds to direct events
   * @param eventName - DOM event name
   * @param cb - function to call
   */
  public direct(eventName: string, cb: Function): Button {
    this.element.addEventListener(eventName, (event) => cb.call(this, event));
    return this;
  }

  public show(): Button {
    this.element.classList.remove("hidden");
    return this;
  }
}

export function createButton(selector: HTMLElement | string): Button {
  return new Button(selector);
}