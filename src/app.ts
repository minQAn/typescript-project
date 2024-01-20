import { Component } from "./components/component.js";
import { InputDialog, MediaData, TextData } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { Composable, PageComponent, PageItemComponent } from "./components/page/page.js";

type InputComponentConstructor<T extends (MediaData | TextData) & Component> = {
    new (): T;
}

class App {
    private readonly page: Component & Composable;
    
    constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);

        /*
        const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        this.page.addChild(image);

        const video = new VideoComponent('Video Title', "https://youtu.be/ThIIWAKK8vA");
        this.page.addChild(video);

        const note = new NoteComponent('Note Title', 'Note Content~!');
        this.page.addChild(note);

        const todo = new TodoComponent('Todo Title', 'Todo Item');
        this.page.addChild(todo); 
        */        
        
        // const imageBtn = document.querySelector('#new-image')! as HTMLButtonElement;
        // imageBtn.addEventListener('click', () => {
        //     const dialog = new InputDialog();
        //     const mediaInputSection = new MediaSectionInput();
        //     dialog.addChild(mediaInputSection);
        //     dialog.attachTo(dialogRoot);

        //     // close 기능
        //     dialog.setOnCloseListener(() => {
        //         dialog.removeFrom(dialogRoot);
        //     });

        //     // submit 기능
        //     dialog.setOnSubmitListener(() => {                
        //         const image = new ImageComponent(mediaInputSection.title, mediaInputSection.url);
        //         this.page.addChild(image);
        //     });
        // });

        // Video Button
        this.bindElementToDialog<MediaSectionInput>(
            '#new-image', 
            MediaSectionInput, 
            (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
        );

        // const videoBtn = document.querySelector('#new-video')! as HTMLButtonElement;
        // videoBtn.addEventListener('click', () => {
        //     const dialog = new InputDialog();
        //     const mediaInputSection = new MediaSectionInput();
        //     dialog.addChild(mediaInputSection);
        //     dialog.attachTo(dialogRoot);

        //     // close 기능
        //     dialog.setOnCloseListener(() => {
        //         dialog.removeFrom(dialogRoot);
        //     });

        //     // submit 기능
        //     dialog.setOnSubmitListener(() => {                
        //         const video = new VideoComponent(mediaInputSection.title, mediaInputSection.url);
        //         this.page.addChild(video);
        //     });
        // });

        // Note Button
        
        
        // const noteBtn = document.querySelector('#new-note')! as HTMLButtonElement;
        // noteBtn.addEventListener('click', () => {
        //     const dialog = new InputDialog();
        //     const textInputSection = new TextSectionInput();
        //     dialog.addChild(textInputSection);
        //     dialog.attachTo(dialogRoot);

        //     // close 기능
        //     dialog.setOnCloseListener(() => {
        //         dialog.removeFrom(dialogRoot);
        //     });

        //     // submit 기능
        //     dialog.setOnSubmitListener(() => {                
        //         const note = new NoteComponent(textInputSection.title, textInputSection.body);
        //         this.page.addChild(note);
        //     });
        // });

        // Todo Button
        this.bindElementToDialog<MediaSectionInput>(
            '#new-video',
            MediaSectionInput,
            (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
        );  
        

        // const todoBtn = document.querySelector('#new-todo')! as HTMLButtonElement;

        // todoBtn.addEventListener('click', () => {
        //     const dialog = new InputDialog();
        //     const textInputSection = new TextSectionInput();
        //     dialog.addChild(textInputSection);
        //     dialog.attachTo(dialogRoot);

        //     // close 기능
        //     dialog.setOnCloseListener(() => {
        //         dialog.removeFrom(dialogRoot);
        //     });

        //     // submit 기능
        //     dialog.setOnSubmitListener(() => {                
        //         const todo = new TodoComponent(textInputSection.title, textInputSection.body);
        //         this.page.addChild(todo);
        //     });
        // });
        this.bindElementToDialog<TextSectionInput>(
            '#new-note',
            TextSectionInput,
            (input: TextSectionInput) => new NoteComponent(input.title, input.body)
        );

        this.bindElementToDialog<TextSectionInput>(
            '#new-todo',
            TextSectionInput,
            (input: TextSectionInput) => new TodoComponent(input.title, input.body)
        );

        // Demo for Test
        this.page.addChild(new ImageComponent('Image Title', 'https://picsum.photos/1000/500'));
        this.page.addChild(new VideoComponent('Video Title', 'https://www.youtube.com/watch?v=0ISpyFPD2LE'));
        this.page.addChild(new NoteComponent('Note Title', 'Content'));
        this.page.addChild(new TodoComponent('Todo Title', 'Content..'));
    }

    private bindElementToDialog<T extends (MediaData | TextData) & Component>(
        selector: string, 
        InputComponent: InputComponentConstructor<T>, 
        makeSection: (input: T) => Component
        ) {
        const element = document.querySelector(selector)! as HTMLButtonElement;
        element.addEventListener('click', () => {
            const dialog = new InputDialog();
            const inputSection = new InputComponent();
            dialog.addChild(inputSection);
            dialog.attachTo(this.dialogRoot);

            // close 기능
            dialog.setOnCloseListener(() => {
                dialog.removeFrom(this.dialogRoot);
            });

            // submit 기능
            dialog.setOnSubmitListener(() => {                
                const component = makeSection(inputSection);
                this.page.addChild(component);
                dialog.removeFrom(this.dialogRoot);
            });
        });
    }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);