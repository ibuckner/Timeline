import { TCategoryLabel } from "./typings/timeline";
import { Slicer, TSlicerState, SlicerModifier } from "@buckneri/js-lib-slicer";
import { Control } from "./control";
import { select } from "select";

class Legend extends Control {
  public btnClose: HTMLElement;
  public btnFilter: HTMLElement;
  public filterOn: boolean = false;
  public title: HTMLElement;

  private _: TCategoryLabel[] = [];
  private _slicer: Slicer<string> = new Slicer<string>();

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

    const items = document.createElement("div");
    items.classList.add("legend-items");
    this.element.appendChild(items);
  }

  /**
   * Clear any filtered legend items
   */
  public clear(): Legend {
    this._slicer.clear();
    Array.from(this.element.querySelectorAll(".filtered"))
      .forEach(el => el.classList.remove("filtered"));
    this.btnFilter.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("legend-filter-clear", { detail: [] }));
    return this;
  }

  /**
   * Populates the legend with categories
   * @param data - list of sequences
   */
  public data(data: TCategoryLabel[]): Legend {
    this._ = data;
    this._slicer.data = this._.map(d => d.name);
    return this;
  }

  /**
   * Draws the legend items
   */
  public draw(): Legend {
    this._.forEach((item: TCategoryLabel) => {
      if (document.querySelector(`[data-label="${item.name}"]`) === null) {
        const el = this._addItem(item.name, item.foreColor, item.backColor);
        if (this.filterOn) {
          el.classList.add("filtered");
        }
      }
    });
    return this;
  }

  /**
   * Handles the click event on legend items
   */
  public handleClick(e: MouseEvent): void {
    const key: string = (e.target as HTMLElement).dataset.label || "";
    const m: number = e.ctrlKey ? SlicerModifier.CTRL_KEY : e.shiftKey ? SlicerModifier.SHIFT_KEY : SlicerModifier.NO_KEY;
    this._slicer.toggle(key, m);  
    this.state();
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

  public state(): Legend {
    this.filterOn = this._slicer.selected === 0 ? false : true;

    this.filterOn
      ? this.btnFilter.classList.remove("hidden")
      : this.btnFilter.classList.add("hidden");

    const filters: string[] = [];
    
    this._slicer.data.forEach((state: TSlicerState, key: string) => {
      const el = document.querySelector(`[data-label="${key}"]`) as HTMLElement;
      if (el) {
        if (state.filtered) {
          el.classList.add("filtered");
        } else {
          el.classList.remove("filtered");
        }
      }
      if (state.selected) {
        filters.push(key);
      }
    });

    const eventName: string = this.filterOn ? "legend-filter" : "legend-filter-clear";
    window.dispatchEvent(new CustomEvent(eventName, { detail: filters }));

    return this;
  }

  public toggle(): Legend {
    super.toggle();
    return this;
  }

  private _addItem(label: string, foreColor: string, backColor: string): HTMLElement {
    const li = document.createElement("div");
    li.classList.add("legend-item");
    li.style.backgroundColor = backColor;
    li.style.borderColor = foreColor;
    li.textContent = label;
    li.dataset.label = label;
    li.addEventListener("click", e => this.handleClick(e));
    (this.element.querySelector(".legend-items") as HTMLElement)
      .appendChild(li);
    return li;
  }
}

export function createLegend(container: HTMLElement | string): Legend {
  return new Legend(container);
}