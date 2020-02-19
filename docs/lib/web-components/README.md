![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)
[![NPM version](https://img.shields.io/npm/v/@buckneri/web-components.svg?style=flat)](https://www.npmjs.com/package/@buckneri/web-components)

# Web components using Stencil

## Using these components

### Script tag

- Put a script tag similar to this `<script type="module" src="https://unpkg.com/web-components/dist/mycomponent.js"></script>` in the head of your html document.

### Node Modules

- Run `npm install my-component --save`
- Put a script tag similar to this `<script type="module" src="node_modules/web-components/dist/mycomponent.js"></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

## Developing components

[Stencil style guide](https://stenciljs.com/docs/style-guide)

### Recommended orginal within component.ts files

@Component()
class
private properties
********
@Element()
********
@State() variables - Inlined decorator
********
@Prop() - Inlined decorator, JSDocs required
@Watch("property_name") - watch items should appear near properties
watchMethodhandler
********
@Event({ eventName: "", composed: true, cancelable: true, bubbles: true }) event_name: EventEmitter - Inlined decorator, JSDocs required
********
Component lifecycle events - ordered by natural call order
connectedCallback() - called on adding to DOM. if 1st, called before willLoad
disconnectedCallback() - called when removed from DOM
componentWillLoad() - once after DOM connection
componentDidLoad() - once after render
componentWillUpdate() - before render() after @Prop/@State change [excl. 1st render()]
componentDidUpdate() - after render() [excl. 1st render()]
componentDidUnload() - after component removed
componentWillRender() - before every render()
componentDidRender() - after every render()
********
@Listen('someEvent')
onSomeEvent(ev: UIEvent)
********
@Method() - Public methods, JSDocs required
async metho_name(): Promise<any>
********
Local methods
********
render() function