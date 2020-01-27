import { select } from "./select";

export class Control {
  public element: HTMLElement;

  public get visible(): boolean {
    return !this.element.classList.contains("hidden");
  }

  public set visible(state: boolean) {
    state
      ? this.element.classList.remove("hidden")
      : this.element.classList.add("hidden");
  }

  constructor(selector: HTMLElement | string) {
    this.element = select(selector);
  }

  public hide(): Control {
    this.visible = false;
    return this;
  }

  /**
   * Responds to indirect events
   * @param eventName - DOM event name
   * @param cb - function to call
   */
  public indirect(eventName: string, cb: Function): Control {
    window.addEventListener(eventName, (event) => cb.call(this, event));
    return this;
  }

  /**
   * Responds to direct events
   * @param eventName - DOM event name
   * @param cb - function to call
   */
  public direct(eventName: string, cb: Function): Control {
    this.element.addEventListener(eventName, (event) => cb.call(this, event));
    return this;
  }

  public show(): Control {
    this.visible = true;
    return this;
  }

  public toggle(): Control {
    this.visible ? this.hide() : this.show();
    return this;
  }
}