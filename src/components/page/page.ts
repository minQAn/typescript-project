import { BaseComponent, Component } from "../component.js";

export interface Composable {
    addChild(child: Component): void;
}

type OnCloseListner = () => void; // callback function

// 재사용성 향상을 위해
interface SectionContainer extends Component, Composable {
    setOnCloseListener(listner: OnCloseListner): void;
}

type SectionContainerConstructor = {
    new (): SectionContainer;

};

// 예를들어 DarkPageItemComponent.. 등을 만든다면 좀더 유연하게 확장 할 수 있다.
export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer{
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

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable{
    constructor(private pageItemConstructor: SectionContainerConstructor) {
        super(`<ul class="page"></ul>`);
    }

    addChild(section: Component) {
        const item = new this.pageItemConstructor(); // 재사용성 향상의 근본적인 이유와 핵심 Line
        item.addChild(section); // 각 section을 page-item__body에 삽입
        item.attachTo(this.element, 'beforeend'); // this.element == <ul class="page"></ul>        
        item.setOnCloseListener(() => {
            item.removeFrom(this.element);
        });
    }
}