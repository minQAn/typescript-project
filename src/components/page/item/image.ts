import { BaseComponent } from "../../component.js";

// export class ImageComponent {
//     private element: HTMLElement;
//     constructor(title: string, url: string) {
//         const template = document.createElement('template');
//         // 사용자에게 전달 받은 것을 innerHTML로 설정하는 것은 위험하다. (javascript code를 주입할 수 있음으로)
//         template.innerHTML = `<section class="image">
//         <div class="image__holder">
//             <img class="image__thumbnail">
//         </div>
//         <p class="image__title"></p>
//         </section>`;
//         this.element = template.content.firstElementChild! as HTMLElement; // type assertion 
//         const imageElement = this.element.querySelector('.image__thumbnail')! as HTMLImageElement;
//         imageElement.src = url;
//         imageElement.alt = title;

//         const titleElement = this.element.querySelector('.image__title')! as HTMLParagraphElement;
//         titleElement.textContent = title;
//     }
//     attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
//         parent.insertAdjacentElement(position, this.element);
//     }
// }


export class ImageComponent extends BaseComponent<HTMLElement> {
    constructor(title: string, url: string) {
        super(`<section class="image">
                    <div class="image__holder">
                        <img class="image__thumbnail">
                    </div> 
                    <h2 class="image__title"></h2>
                </section>`);

        const imageElement = this.element.querySelector('.image__thumbnail')! as HTMLImageElement;
        imageElement.src = url;
        imageElement.alt = title;

        const titleElement = this.element.querySelector('.image__title')! as HTMLHeadingElement;
        titleElement.textContent = title;
    }
}