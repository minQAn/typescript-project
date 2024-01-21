import { BaseComponent } from "../../component.js";

export class VideoComponent extends BaseComponent<HTMLElement> {
    constructor(title: string, url: string) {
        super(`<section class="video">
                    <div class="video__player">
                        <iframe class="video__iframe"></iframe>
                    </div>
                    <h3 class="video__title"></h3>
                </section>`);

        const iframe = this.element.querySelector('.video__iframe')! as HTMLIFrameElement;

        // iframe.src = url; // url -> videoId -> embed (embed가 된 url를 써야 정상 사용 가능)
        iframe.src = this.converToEmbeddedURL(url); 

        const titleElement = this.element.querySelector('.video__title')! as HTMLHeadingElement;
        titleElement.textContent = title;
    }


    /*
    - input
    https://www.youtube.com/watch?v=ThIIWAKK8vA
    https://www.youtu.be/ThIIWAKK8vA
    -> output
    https://www.youtube.com/embed/ThIIWAKK8vA
    정규표현식 Regex 사용하여 id 추출
    참고자료: https://regexr.com/5l6nr
    */
    private converToEmbeddedURL(url: string): string {         
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;
        const match = url.match(regExp);

        // console.log(match);

        const videoId = match? match[1] || match[2] : undefined;
        if(videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        return url;
    }
}




/*
<iframe 
    width="557" 
    height="313" 
    src="https://www.youtube.com/embed/ThIIWAKK8vA" 
    title="다이어 교체 실점을 본 &#39;12호골&#39; 손흥민의 반응 (Ft. 요리스)" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
</iframe>
*/