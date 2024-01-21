# Drag & Drop = Draggable & Droppable

### Drag되는 컴포넌트는
'start', 'end' & 'enter', 'leave' 의 개념이 있다.

- start: 드래그가 시작되는 순간
- end: 드래그에서 마우스를 때고 완전히 끝나는 순간('drop' event 보다 나중에 끝남)
&
- enter: 해당 요소에 마우스가 들어왔을 때 발생하는 이벤트
- leave: 해당 요소에서 마우스가 나갈 때 발생하는 이벤트

### Drop되는 곳의 컴포넌트는
'Over', 'Drop'의 개념이 있다.

- over: 해당 요소에 마우스가 올라왔을 때 발생하는 이벤트. 
- drop: 해당 요소에 마우스를 때고 드랍했을 때 발생하는 이벤트.

⚠️ dragover는 drop을 허용해주기 위해 event.preventDefault()를 해줘야 한다.
dragover의 이본 옵션이 cancel되는 되기 때문인 것 같음.
> in the dragover event handler for the target container, we call event.preventDefault(), which enables it to receive drop events.

⚠️ drop에서 또한 event.preventDefault()를 해줘야 하는데, 
> Call preventDefault() to prevent the browser default handling of the data <strong>(default is open as link on drop)</strong>

<a href="https://ko.react.dev/reference/react-dom/components/common">참고자료 링크</a>


### Drag Target과 Drop Target 으로 나눠 구분되어 데이터를 관리해 작업을 처리한다.
```
interface SectionContainer extends Component, Composable {
    setOnCloseListener(listner: OnCloseListner): void;
    setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
    muteChildren(state: 'mute' | 'unmute'): void;
}
```

muteChildren은 drag이벤트가 section에서 dragstart, dragend가 될때에 발생하며
SectionConatainer의 자식요소에서 드래그 이벤트가 발생하여 자식요소들 위에서의 드래그 이벤트 기능은 동작이 되지 않게 하기 위해 자식요소들의 class에 mute-item을 추가하여 css에서 <a href="https://yari-demos.prod.mdn.mozit.cloud/ko/docs/Web/CSS/pointer-events">pointer-event: none</a>처리 하여 포인터발생이벤트(드래그이벤트)가 발생되지 않도록 하였다.

```
getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
}

this.dropTarget.attach(this.dragTarget, srcElementY < dropY? 'afterend' : 'beforebegin');      
```

엘리먼트를 형제 레벨에 넣는 attach 함수를 인터페이스에 추가하였으며, 드래그 해오는 요소가 드랍하는 요소의 위치 Y값에 따라 추가하는 순서의 위치가 달리지도록 getBoundingClientRect().y 함수를 이용하여 값을 가져와 단항 연산자를 통하여 구현하였다. 
