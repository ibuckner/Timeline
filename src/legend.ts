import { TSequence, TCategory, TLegendItem } from "./typings/timeline";
import { Slicer } from "@buckneri/js-lib-slicer";

export class Legend {
  public btnClose: HTMLElement;
  public btnFilter: HTMLElement;
  public element: HTMLElement;
  public title: HTMLElement;
  public get visible(): boolean {
    return !this.element.classList.contains("hidden");
  }

  private _legendMap: Map<string, TLegendItem> = new Map<string, TLegendItem>();
  private _slicer: Slicer<string> = new Slicer<string>();

  constructor(container: HTMLElement) {
    this.element = document.createElement("div");
    this.element.classList.add("legend", "hidden");
    container.appendChild(this.element);

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
    window.dispatchEvent(new CustomEvent("legend-filter", { detail: [] }));
    return this;
  }

  /**
   * Populates the legend with categories
   * @param {TSequence[]} data - list of categories
   */
  public data(data: TSequence[]): Legend {
    const labels: string[] = [];
    data.forEach((s: TSequence) => {
      s.categories.forEach((c: TCategory) => {
        if (!this._legendMap.has(c.name)) {
          labels.push(c.name);
          this._legendMap.set(c.name, {
            backColor: c.backColor,
            foreColor: c.foreColor,
            name: c.name
          });
        }
      });
    });
    this._slicer.data = labels;
    return this;
  }

  /**
   * Draws the legend items
   */
  public draw(): void {
    (this.element.querySelector(".legend-items") as HTMLElement).innerHTML = "";
    this._legendMap.forEach((item: TLegendItem) => {
      item.el = this._addItem(item.name, item.foreColor, item.backColor);
      this._legendMap.set(item.name, item);
    });
  }

  /**
   * Handles the click event on legend items
   */
  public handleClick(e: any): void {
    const key: string = (e.target as HTMLElement).textContent || "";
    const clicked: TLegendItem | undefined = this._legendMap.get(key);

    if (clicked) {
      this._slicer.toggle(clicked.name, e.ctrlKey);
    }

    const selectionList: string[] = [];
    this.btnFilter.classList.add("hidden");
    this._slicer.data.forEach((value: any, key: string) => {
      const item = this._legendMap.get(key);
      if (value.selected) {
        selectionList.push(key);
      }
      if (value.filtered) {
        item?.el?.classList.add("filtered");
        this.btnFilter.classList.remove("hidden");
      } else {
        item?.el?.classList.remove("filtered");
      }
    });
        
    window.dispatchEvent(new CustomEvent("legend-filter", { detail: selectionList }));
  }

  /**
   * Hide legend
   */
  public hide(): void {
    this.element.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("legend-hidden"));
  }

  /**
   * Display legend
   */
  public show(): void {
    this.element.classList.remove("hidden");
    window.dispatchEvent(new CustomEvent("legend-visible"));
  }

  /**
   * Show/hide legend
   */
  public toggle(): void {
    this.visible ? this.hide() : this.show();
  }

  private _addItem(label: string, foreColor: string, backColor: string): HTMLElement {
    const li = document.createElement("div");
    li.classList.add("legend-item");
    li.style.backgroundColor = backColor;
    li.style.borderColor = foreColor;
    li.textContent = label;
    li.addEventListener("click", e => this.handleClick(e));
    (this.element.querySelector(".legend-items") as HTMLElement)
      .appendChild(li);
    return li;
  }

}