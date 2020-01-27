import { Control } from "./control";

/**
 * Container for holding button-related actions and events
 */
class Button extends Control {
  constructor(selector: HTMLElement | string) {
    super(selector);
  }
}

export function createButton(selector: HTMLElement | string): Button {
  return new Button(selector);
}