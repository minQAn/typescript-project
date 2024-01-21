import { BaseComponent, Component } from "../component.js";

export interface Composable {
    addChild(child: Component): void;
}


type OnCloseListner = () => void; // callback function
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListener<T extends Component> = (target: T, state: DragState) => void;

// 재사용성 향상을 위해
interface SectionContainer extends Component, Composable {
    setOnCloseListener(listner: OnCloseListner): void;
    setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
    muteChildren(state: 'mute' | 'unmute'): void;
    getBoundingRect(): DOMRect;
    onDropped(): void;
}

type SectionContainerConstructor = {
    new(): SectionContainer;

};


// 예를들어 DarkPageItemComponent.. 등을 만든다면 좀더 유연하게 확장 할 수 있다.
export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer {
    private closeListner?: OnCloseListner;
    private dragStateListener?: OnDragStateListener<PageItemComponent>; // 현재 어떤 컴포넌트가 드래깅되고있고, 어떤 드래그 이벤트가 발생중인지 알려주는 콜백함수

    constructor() {
        super(`<li draggable="true" class="page-item">
                    <section class="page-item__body"></section>
                    <div class="page-item__controls">
                        <button class="close">&times;</button>
                    </div>
                </li>`);

        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.onclick = () => {
            this.closeListner && this.closeListner(); // if closelistner is not null;
        };

        // Drag 시작과 끝
        this.element.addEventListener('dragstart', (event: DragEvent) => {
            this.onDragStart(event);
        });
        this.element.addEventListener('dragend', (event: DragEvent) => {
            this.onDragEnd(event);
        });
        this.element.addEventListener('dragenter', (event: DragEvent) => {
            this.onDragEnter(event);
        });
        this.element.addEventListener('dragleave', (event: DragEvent) => {
            this.onDragLeave(event);
        });

    }

    // Drag 시작과 끝 & 진입과 떠날 때 
    onDragStart(_: DragEvent) {
        this.notifyDragObservers('start');
        this.element.classList.add('lifted');
    }
    onDragEnd(_: DragEvent) {
        this.notifyDragObservers('stop');
        this.element.classList.remove('lifted');
    }
    onDragEnter(_: DragEvent) {
        this.notifyDragObservers('enter');
        this.element.classList.add('drop-area');
    }
    onDragLeave(_: DragEvent) {
        this.notifyDragObservers('leave');
        this.element.classList.remove('drop-area'); // 여기서 Leave가 안먹히고 있음으로 onDropped 함수를 따로 생성
    }
    // 여기서 한번만 바꾸면 위의 4가지에서 굳이 안바꿔줘도 됨.
    notifyDragObservers(state: DragState) {
        this.dragStateListener && this.dragStateListener(this, state);
    }
    setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
        this.dragStateListener = listener;
    }
    muteChildren(state: "mute" | "unmute") {
        if(state === 'mute') {
            this.element.classList.add('mute-children');
        } else {
            this.element.classList.remove('mute-children');
        }        
    }
    getBoundingRect(): DOMRect {
        return this.element.getBoundingClientRect();
    }
    onDropped() {
        this.element.classList.remove('drop-area');        
    }

    addChild(child: Component) {
        const container = this.element.querySelector('.page-item__body')! as HTMLElement;
        child.attachTo(container);
    }

    // set Listeners
    setOnCloseListener(listner: OnCloseListner) {
        this.closeListner = listner;
    }
    
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    private children = new Set<SectionContainer>(); // Set자료구조는 중복이 불가능하다. 자식을 모두 가지고 있는다. 이유는 버블링을 막기위해
    private dragTarget?: SectionContainer;
    private dropTarget?: SectionContainer;
    private sound = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3"
    );

    constructor(private pageItemConstructor: SectionContainerConstructor) {
        super(`<ul class="page"></ul>`);

        // 드래그한걸 놓을 수 있는 영역에서 over과 drop을 정의
        this.element.addEventListener('dragover', (event: DragEvent) => {
            this.onDragOver(event);
        });

        this.element.addEventListener('drop', (event: DragEvent) => {
            this.onDrop(event);
        });        
    }

    // Drag Over와 Drop을 할 때에는 preventDefault를 꼭 호출해야 한다.
    onDragOver(event: DragEvent) {
        event.preventDefault();
    }
    onDrop(event: DragEvent) {
        event.preventDefault();
        // 여기서 위치를 바꾼다.
        if(!this.dropTarget) {
            return;
        }
        if(this.dragTarget && this.dragTarget !== this.dropTarget) {
            const dropY = event.clientY;
            const srcElementY = this.dragTarget.getBoundingRect().y;
            
            this.sound.play();

            this.dragTarget.removeFrom(this.element); // 일단 제거            
            // 형제 레벨에 추가하는 api필요 > attach 함수 추가
            this.dropTarget.attach(this.dragTarget, srcElementY < dropY? 'afterend' : 'beforebegin');      
        }

        // Leave가 발생하지 않아 drop후에 style border가 사라지지 않음으로 여기서 명확히 해줌.
        this.dropTarget.onDropped();
    }

    addChild(section: Component) {
        const item = new this.pageItemConstructor(); // 재사용성 향상의 근본적인 이유와 핵심 Line
        item.addChild(section); // 각 section을 page-item__body에 삽입
        item.attachTo(this.element, 'beforeend'); // this.element == <ul class="page"></ul>        
        item.setOnCloseListener(() => {
            item.removeFrom(this.element);
            this.children.delete(item);
        });
        this.children.add(item); // 추가 될때마다 children요소에 추가
        item.setOnDragStateListener((target: SectionContainer, state: DragState) => { // 약간 Reducer같은데?
            // console.log(target, state);
            switch(state) { // start와 stop(dragend)는 클릭 드래그하는 요소, enter와 leave는 마우스가 들어오는 요소
                case 'start':
                    this.dragTarget = target;
                    this.updateSections('mute');
                    break;
                case 'stop':
                    this.dragTarget = undefined;
                    this.updateSections('unmute');                    
                    break;
                case 'enter':                    
                    this.dropTarget = target;
                    break;
                case 'leave':
                    this.dropTarget = undefined;
                    break;
                default:
                    throw new Error(`Unsupported state: ${state}`);
            }
        });
    }

    private updateSections(state: 'mute' | 'unmute') {
        this.children.forEach((section: SectionContainer) => { // section in children is <li class='page-item'>: PageItemComponent
            section.muteChildren(state);
        })
    }
}