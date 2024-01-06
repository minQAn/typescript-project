import { BaseComponent, Component } from "../component.js";

export interface Composable {
    addChild(child: Component): void;
}

type OnCloseListner = () => void; // callback function

class PageItemComponent extends BaseComponent<HTMLElement> implements Composable{
    private closeListner?: OnCloseListner;
    constructor() {
        super(`<li class="page-item">
                    <section class="page-item__body"></section>
                    <div class="page-item__controls">
                        <button class="close">&times;</button>
                    </div>
                </li>`);       
                
        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.onclick = () => {
            this.closeListner && this.closeListner(); // if closelistner is not null;
        };
    }

    addChild(child: Component) {
        const container = this.element.querySelector('.page-item__body')! as HTMLElement;
        child.attachTo(container);
    }

    setOnCloseListener(listner: OnCloseListner) {
        this.closeListner = listner;
    }
}

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

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable{
    constructor() {
        super(`<ul class="page"></ul>`);
    }

    addChild(section: Component) {
        const item = new PageItemComponent();
        item.addChild(section); // 각 section을 page-item__body에 삽입
        item.attachTo(this.element, 'beforeend'); // this.element == <ul class="page"></ul>        
        item.setOnCloseListener(() => {
            item.removeFrom(this.element);
        });
    }
}