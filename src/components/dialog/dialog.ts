import { BaseComponent, Component } from "../component.js";
import { Composable } from "../page/page.js";

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export interface MediaData {
    readonly title: string;
    readonly url: string;
}

export interface TextData {
    readonly title: string;
    readonly body: string;
}

export class InputDialog extends BaseComponent<HTMLElement> implements Composable {
    private closeListener?: OnCloseListener;
    private submitListener?: OnSubmitListener;
    constructor(){
        super(`
            <dialog class="dialog">
                <div class="dialog__bg">
                    <div class="dialog__container">
                        <button class="close">&times;</button>
                        <div id="dialog__body"></div>
                        <button class="dialog__submit">ADD</button>
                    </div>   
                </div> 
            </dialog>
        `);

        // 배경 및 close 버튼 클릭 시 Dialog 창 끄기                            
        const dialogBg = this.element.querySelector('.dialog__bg')! as HTMLElement;
        dialogBg.onclick = (event: any) => {
            const target = event.target as Element;            
            // 클릭하는 요소 dialog의 배경과 close버튼을 누르면 꺼지도록 Selector(clssName)을 통해서 적용
            if(!target.matches('.dialog__bg, .close')) { 
                return;
            }          
            this.closeListener && this.closeListener();  
        }

        const submitBtn = this.element.querySelector('.dialog__submit')! as HTMLButtonElement;
        submitBtn.onclick = () => {            
            this.submitListener && this.submitListener();
        }
    }

    setOnCloseListener(listener: OnCloseListener) {
        this.closeListener = listener;
    }
    setOnSubmitListener(listener: OnSubmitListener) {
        this.submitListener = listener;
    }

    addChild(child: Component) {
        const body = this.element.querySelector('#dialog__body')! as HTMLElement;
        child.attachTo(body);
    }
}