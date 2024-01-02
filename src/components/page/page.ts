import { BaseComponent } from "../component.js";

// export class PageComponent {
//     private element: HTMLUListElement;
//     constructor() {
//         this.element = document.createElement('ul');
//         this.element.setAttribute('class', 'page');
//         this.element.textContent = 'This is PageComponent';
//     }
//     attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
//         parent.insertAdjacentElement(position, this.element);
//     }
// }

export class PageComponent extends BaseComponent<HTMLUListElement> {
    constructor() {
        super(`<ul class="page">This is PageComponent!</ul>`);
    }
}