import { numberToTime } from "./format";
import { Control } from "./control";
import { select } from "./select";

/**
 * Container for holding inspector window-related actions and events
 */
export class Inspector extends Control {
  public btnClose: HTMLElement;  
      
  constructor(selector: HTMLElement | string) {
    super(selector);
    this.element = document.createElement("div");
    this.element.classList.add("objExplorer", "inspector", "hidden");
    select(selector).appendChild(this.element);

    const badge = document.createElement("div");
    badge.classList.add("badge");
    this.element.appendChild(badge);

    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    this.element.appendChild(wrapper);

    const menu = document.createElement("div");
    menu.classList.add("menu-inspector");
    wrapper.appendChild(menu);

    this.btnClose = document.createElement("div");
    this.btnClose.classList.add("close-inspector", "menu-item");
    this.btnClose.textContent = "close";
    this.btnClose.addEventListener("click", () => this.toggle());
    menu.appendChild(this.btnClose);

    const content = document.createElement("div");
    content.classList.add("content");
    wrapper.appendChild(content);
  }

  /**
   * Draws the inspector content
   */
  public draw(d?: any): Inspector {
    const badge = (this.element.querySelector(".badge") as HTMLElement);
    const content = (this.element.querySelector(".content") as HTMLElement);
    let message = "Nothing selected";
    if (d !== undefined) {
      if (d.time !== undefined) {
        message = `These appointments are categorised as <b>${d.parent.name}</b>.<br>You selected a booking scheduled for ${numberToTime(d.time)}. The waiting time until seen was ${d.wait} minutes.`;
        badge.style.backgroundColor = d.el.style.borderColor;
      } else if (d.maxWait !== undefined) {
        message = `<b>${d.name}</b><br>The opening times are ${numberToTime(d.start)} to ${numberToTime(d.end)}<br>
        The longest waiting time was ${d.maxWait} miuntes. The median is ${d.stat.median} minutes.`;
        badge.style.backgroundColor = d.el.style.backgroundColor;
      } else if (d.avgWait !== undefined) {
        message = `This activity starts from ${numberToTime(d.start)} and ends at ${numberToTime(d.end)}. The average waiting time was ${Math.floor(d.avgWait)} minutes`;
        badge.style.backgroundColor = "#eee";
      }
    }
    content.innerHTML = message;
    return this;
  }

  public hide(): Inspector {
    super.hide();
    window.dispatchEvent(new CustomEvent("inspector-hidden"));
    return this;
  }

  public show(): Inspector {
    super.show();
    window.dispatchEvent(new CustomEvent("inspector-visible"));
    return this;
  }

  /**
   * Show/hide inspector
   */
  public toggle(): Inspector {
    super.toggle();
    return this;
  }
}

export function createInspector(container: HTMLElement | string): Inspector {
  return new Inspector(container);
}