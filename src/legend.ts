import { TCategoryLabel } from "./typings/timeline";
import * as components from "@buckneri/web-components";
import { Control } from "./control";
import { select } from "select";

class Legend extends Control {
  public btnClose: HTMLElement;
  public btnFilter: HTMLElement;
  public slicer: HTMLNelSlicerElement;
  public title: HTMLElement;
  
  constructor(selector: HTMLElement | string) {
    super(selector);
    this.element = document.createElement("div");
    this.element.classList.add("legend", "hidden");
    select(selector).appendChild(this.element);
    
    const menu = document.createElement("div");
    menu.classList.add("menu-legend");
    this.element.appendChild(menu);

    this.btnFilter = document.createElement("div");
    this.btnFilter.classList.add("filter-legend", "menu-item", "hidden");
    this.btnFilter.textContent = "clear filter";
    this.btnFilter.addEventListener("click", () => this.clear());
    menu.appendChild(this.btnFilter);

    this.btnClose = document.createElement("div");
    this.btnClose.classList.add("close-legend", "menu-item");
    this.btnClose.textContent = "close";
    this.btnClose.addEventListener("click", () => this.toggle());
    menu.appendChild(this.btnClose);

    this.title = document.createElement("h3");
    this.title.textContent = "Categories";
    this.element.appendChild(this.title);

    this.slicer = document.createElement("nel-slicer");
    this.slicer.classList.add("slicer");
    this.element.appendChild(this.slicer);

    this.slicer.addEventListener("selected", (e: any) => {
      this.state(e.detail);
    });
  }

  /**
   * Clear any filtered legend items
   */
  public async clear(): Promise<Legend> {
    this.slicer.clear = true;
    window.dispatchEvent(new CustomEvent("legend-filter-clear", { detail: [] }));
    return this;
  }

  /**
   * Draws the legend items
   */
  public draw(items: TCategoryLabel[]): Legend {
    items.forEach((item: TCategoryLabel) => {
      if (document.querySelector(`[data-label="${item.name}"]`) === null) {
        this._addItem(item.name, item.foreColor, item.backColor);
      }
    });
    return this;
  }

  public hide(): Legend {
    super.hide();
    window.dispatchEvent(new CustomEvent("legend-hidden"));
    return this;
  }

  public show(): Legend {
    super.show();
    window.dispatchEvent(new CustomEvent("legend-visible"));
    return this;
  }

  public state(data: string[]): Legend {
    Array.from(document.querySelectorAll(".category"))
      .forEach((el: any) => {
        if (data.length === 0) {
          el.classList.remove("filtered");
        } else {
          el.classList.add("filtered");
        }
        el.classList.remove("selected");
      });

    if (data.length === 0) {
      return this;
    }

    data.forEach((state: any) => {
      const el = document.querySelector(`[data-category="${state}"]`) as HTMLElement;
      if (el) {
        el.classList.remove("filtered");
        el.classList.add("selected");
      }
    });

    return this;
  }

  public toggle(): Legend {
    super.toggle();
    return this;
  }

  private _addItem(label: string, foreColor: string, backColor: string): HTMLElement {
    const li = document.createElement("div");
    li.classList.add("slicer-item");
    li.style.backgroundColor = backColor;
    li.style.borderColor = foreColor;
    li.textContent = label;
    li.dataset.label = label;
    this.slicer.appendChild(li);
    return li;
  }
}

export function createLegend(container: HTMLElement | string): Legend {
  return new Legend(container);
}