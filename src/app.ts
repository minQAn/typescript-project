import { Component } from "./components/component.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { Composable, PageComponent, PageItemComponent } from "./components/page/page.js";

class App {
    private readonly page: Component & Composable;
    
    constructor(appRoot: HTMLElement) {
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);

        const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        this.page.addChild(image);
        // image.attachTo(appRoot, 'beforeend'); // beforeend = 마지막에

        const video = new VideoComponent('Video Title', "https://youtu.be/ThIIWAKK8vA");
        this.page.addChild(video);
        // video.attachTo(appRoot, 'beforeend');

        const note = new NoteComponent('Note Title', 'Note Content~!');
        this.page.addChild(note);
        // note.attachTo(appRoot, 'beforeend');

        const todo = new TodoComponent('Todo Title', 'Todo Item');
        this.page.addChild(todo); 
        // todo.attachTo(appRoot, 'beforeend');

    }
}

new App(document.querySelector('.document')! as HTMLElement);