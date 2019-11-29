import { fromEvent, Observable, Subject } from 'rxjs';
import { TBSelection } from './selection';

export class Cursor {
  onInput: Observable<string>;
  onDelete: Observable<void>;
  onFocus: Observable<void>;
  onBlur: Observable<void>;
  readonly elementRef = document.createElement('div');

  private input = document.createElement('textarea');
  private cursor = document.createElement('span');
  private inputWrap = document.createElement('span');

  private inputEvent = new Subject<string>();
  private deleteEvent = new Subject<void>();
  private focusEvent = new Subject<void>();
  private blurEvent = new Subject<void>();

  private timer: any = null;

  private set display(v: boolean) {
    this._display = v;
    this.cursor.style.visibility = v ? 'visible' : 'hidden';
  }

  private get display() {
    return this._display;
  }

  private _display = true;
  private flashing = true;

  constructor(private context: Document, private selection: TBSelection) {
    this.onInput = this.inputEvent.asObservable();
    this.onDelete = this.deleteEvent.asObservable();
    this.onFocus = this.focusEvent.asObservable();
    this.onBlur = this.blurEvent.asObservable();

    this.elementRef.classList.add('tanbo-editor-selection');
    this.cursor.classList.add('tanbo-editor-cursor');
    this.inputWrap.classList.add('tanbo-editor-input-wrap');
    this.input.classList.add('tanbo-editor-input');

    this.inputWrap.appendChild(this.input);

    this.elementRef.appendChild(this.inputWrap);
    this.elementRef.appendChild(this.cursor);
    fromEvent(this.input, 'input').subscribe(() => {
      this.inputEvent.next(this.input.value);
    });

    fromEvent(this.input, 'blur').subscribe(() => {
      this.blurEvent.next();
    });

    fromEvent(this.input, 'keydown').subscribe((ev: KeyboardEvent) => {
      if (ev.key === 'Backspace') {
        this.deleteEvent.next();
      }
    });
    fromEvent(context, 'mousedown').subscribe(() => {
      this.flashing = false;
      this.focus();
      // this.context.getSelection().removeAllRanges();
    });
    fromEvent(context, 'mouseup').subscribe(() => {
      this.flashing = true;
    });

    selection.onSelectionChange.subscribe(s => {
      if (s.collapsed) {
        if (s.rangeCount) {
          let rect = s.firstRange.rawRange.getBoundingClientRect();
          if (!rect.height) {
            rect = (s.focusNode as HTMLElement).getBoundingClientRect();
          }
          this.show(rect);
        }
      } else {
        this.hide();
      }
    })
  }

  private focus() {
    this.input.value = '';
    this.focusEvent.next();
  }

  private show(position: { left: number, top: number, height: number }) {
    this.elementRef.style.left = position.left + 'px';
    this.elementRef.style.top = position.top + 'px';
    this.elementRef.style.height = position.height + 'px';
    this.display = true;
    clearTimeout(this.timer);
    const toggleShowHide = () => {
      this.display = !this.display || !this.flashing;
      this.timer = setTimeout(toggleShowHide, 400);
    };
    this.timer = setTimeout(toggleShowHide, 400);
    this.input.focus();
  }

  private hide() {
    this.display = false;
    clearTimeout(this.timer);
  }
}
