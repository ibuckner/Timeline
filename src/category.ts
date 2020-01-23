import { TCategory } from "./typings/timeline";
import { numberToTime } from "./format";

export class Category {
  private _data: TCategory = { backColor: "#000", end: 0, foreColor: "#fff", name: "Unnamed", points: [], start: 0 };

  constructor(options: any) {
    this.neighborCount = options.neighborCount !== undefined ? options.neighborCount : 0;
  }

  public data(d?: TCategory): any {
    if (d) {
      this._data = d;
      return this;
    }
    return this._data;
  }

  public neighborCount: number;

  /**
   * Once drawn, each sequence item holds the DOM object connected to it
   * @param container 
   */
  public draw(container: HTMLElement): Category {
    const w: number = Math.floor(100 / (this.neighborCount === 0 ? 1 : this.neighborCount));
    
    if (!this._data.el) {
      this._data.el = document.createElement("div");
      this._data.el.classList.add("category");
      this._data.el.addEventListener("click", () => console.log("Not available"));
      this._data.el.dataset.category = this._data.name;
      container.appendChild(this._data.el);
    }
    this._data.el.title = `${this._data.name}\nOpening times: ${numberToTime(this._data.start)}-${numberToTime(this._data.end)}\nMax waiting time (min): ${this._data.maxWait}`;
    this._data.el.style.backgroundColor = this._data.backColor;
    this._data.el.style.borderColor = this._data.foreColor;
    this._data.el.addEventListener("click", (e) => {
      e.stopPropagation();
      const eventName: string = this._data?.el?.classList.contains("highlight") ? "category-unselect" : "category-select";
      if (eventName === "category-unselect") {
        this._data?.el?.classList.remove("highlight");
      }
      dispatchEvent(new CustomEvent(eventName, { detail: this._data }));
    });
      
    if (this._data && this._data.parent) {
      const rel: number = (this._data.end - this._data.start) / (this._data.parent.end - this._data.parent.start);
      this._data.el.style.height = `${Math.floor(99.5 * rel)}%`;
      const y: number = (this._data.start - this._data.parent.start) / (this._data.parent.end - this._data.parent.start);
      this._data.el.style.transform = `translate(0, ${Math.floor(100 * y)}%)`;
      if (this._data.maxWait && this._data.parent.avgWait !== undefined) {
        this._data.el.style.flexBasis = `${w * (this._data.maxWait / this._data.parent.avgWait)}%`;
      } else {
        throw new Error("Category is missing average width and maximum waiting times");
      }  
    }
    
    return this;
  }
}