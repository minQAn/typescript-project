export interface Component {
    attachTo(parent: HTMLElement, position?: InsertPosition): void;
    removeFrom(parent: HTMLElement): void;
    attach(component: Component, position?: InsertPosition): void;
}

/**
 * Encapsulate the HTML element creation
 */
export class BaseComponent<T extends HTMLElement> implements Component {
    protected readonly element: T;

    constructor(htmlString: string) {
        const template = document.createElement('template');
        template.innerHTML = htmlString;
        this.element = template.content.firstElementChild! as T; // type assertion
    }

    attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
        parent.insertAdjacentElement(position, this.element);
    }

    removeFrom(parent: HTMLElement) {        
        if(parent !== this.element.parentElement){
            throw new Error('Parent mismatch!');
        }
        parent.removeChild(this.element);
    }
    
    // 형제 레벨에 넣음
    attach(component: Component, position: InsertPosition = 'beforebegin') {
        component.attachTo(this.element, position);
    }
}