import { TSequence, TCategory } from "./typings/timeline";

export class Legend {
  public btnClose: HTMLElement;
  public element: HTMLElement;
  public items: HTMLElement;
  public title: HTMLElement;

  private _legendMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(container: HTMLElement) {
    this.element = document.createElement("div");
    this.element.classList.add("legend", "hidden");
    container.appendChild(this.element);
    this.btnClose = document.createElement("div");
    this.btnClose.classList.add("close-legend");
    this.btnClose.textContent = "close";
    this.btnClose.addEventListener("click", () => this.toggle);
    this.element.appendChild(this.btnClose);
    this.title = document.createElement("h3");
    this.title.textContent = "Categories";
    this.element.appendChild(this.title);
    this.items = document.createElement("div");
    this.items.classList.add("legend-items");
    this.element.appendChild(this.items);
  }

  public get visible(): boolean {
    return !this.element.classList.contains("hidden");
  }

  /**
   * Adds a legend item to the legend
   * @param {string} label - legend text
   * @param {string} foreColor -  legend fore color (CSS)
   * @param {string} backColor - legend item background color (CSS)
   */
  public addItem(label: string, foreColor: string, backColor: string): void {
    const li = document.createElement("div");
    li.classList.add("legend-item");
    li.style.backgroundColor = backColor;
    li.style.borderColor = foreColor;
    li.textContent = label;
    this.items.appendChild(li);
  }

  /**
   * Hide legend
   */
  public hide(): void {
    this.element.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("legend-hidden"));
  }

  /**
   * Populates the legend with categories
   * @param {TSequence[]} categories - list of categories
   */
  public populate(sequences: TSequence[]): void {
    sequences.forEach((s: TSequence) => {
      s.categories.forEach((c: TCategory) => {
        if (!this._legendMap.has(c.name)) {
          this.addItem(c.name, c.foreColor, c.backColor);
          this._legendMap.set(c.name, true);
        }
      });
    });
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
}