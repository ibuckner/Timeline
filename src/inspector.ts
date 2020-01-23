import { numberToTime } from "./format";
import { select } from "./select";

export class Inspector {
  public btnClose: HTMLElement;  
  public element: HTMLElement;
  
  public get visible(): boolean {
    return !this.element.classList.contains("hidden");
  }
  
  constructor(container: HTMLElement | string) {
    this.element = document.createElement("div");
    this.element.classList.add("objExplorer", "inspector", "hidden");
    select(container).appendChild(this.element);

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

    window.addEventListener("point-select", (e: any) => this.draw(e.detail).show());
    window.addEventListener("category-select", (e: any) => this.draw(e.detail).show());
    window.addEventListener("sequence-select", (e: any) => this.draw(e.detail).show());

    window.addEventListener("point-unselect", () => this.hide());
    window.addEventListener("category-unselect", () => this.hide());
    window.addEventListener("sequence-unselect", () => this.hide());
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

  /**
   * Hide inspector
   */
  public hide(): Inspector {
    this.element.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("inspector-hidden"));
    return this;
  }

  /**
   * Display inspector
   */
  public show(): Inspector {
    this.element.classList.remove("hidden");
    window.dispatchEvent(new CustomEvent("inspector-visible"));
    return this;
  }

  /**
   * Show/hide inspector
   */
  public toggle(): Inspector {
    this.visible ? this.hide() : this.show();
    return this;
  }
}

export function createInspector(container: HTMLElement | string): Inspector {
  return new Inspector(container);
}