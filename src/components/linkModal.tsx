import {
  customElements,
  ControlElement,
  Styles,
  Module,
  Container,
  Modal,
  Input,
  Control
} from '@ijstech/components';
import { getModalContainer } from './utils';
const Theme = Styles.Theme.ThemeVars;

export type inputChangedCallback = (target: Input, event: KeyboardEvent) => void;

interface ScomEditorMdLinkElement extends ControlElement {
  text?: string;
  url?: string;
  onInputChanged?: inputChangedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-editor-md-link']: ScomEditorMdLinkElement;
    }
  }
}

interface ILink {
  text?: string;
  url?: string;
}

@customElements('i-scom-editor-md-link')
export class ScomEditorMdLink extends Module {
  private mdLink: Modal;
  private inputLink: Input;
  private inputText: Input;

  private _data: ILink;

  static async create(options?: ScomEditorMdLinkElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.handleInput = this.handleInput.bind(this);
  }

  onInputChanged: inputChangedCallback;

  get text() {
    return this._data.text ?? '';
  }
  set text(value: string) {
    this._data.text = value ?? '';
  }

  get url() {
    return this._data.url ?? '';
  }
  set url(value: string) {
    this._data.url = value ?? '';
  }

  setData(value: ILink) {
    this._data = value;
    this.inputLink.value = this.url;
    this.inputText.value = this.text;
  }

  getData() {
    return this._data;
  }

  showModal(parent?: Control) {
    getModalContainer().appendChild(this.mdLink);
    this.mdLink.position = 'fixed';
    if (parent) this.mdLink.linkTo = parent;
    this.mdLink.refresh();
    this.mdLink.visible = true;
  }

  closeModal() {
    this.mdLink.visible = false;
  }

  private handleInput(target: Input, event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.onInputChanged) this.onInputChanged(target, event);
    }
  }

  private handleClosed() {
    getModalContainer().removeChild(this.mdLink);
  }

  init() {
    super.init();
    this.onInputChanged = this.getAttribute('onInputChanged', true) || this.onInputChanged;
    const text = this.getAttribute('text', true);
    const url = this.getAttribute('url', true);
    this.setData({text, url});
  }

  render() {
    return (
      <i-modal
        id="mdLink"
        popupPlacement="bottom"
        minWidth={'18.75rem'}
        maxWidth={'max-content'}
        border={{radius: '0.375rem'}}
        padding={{top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem'}}
        boxShadow={Theme.shadows[1]}
        margin={{top: '1rem'}}
        isChildFixed={true}
        closeOnScrollChildFixed={true}
        showBackdrop={false}
        onClose={this.handleClosed}
      >
        <i-vstack
          id="pnlLink"
          maxHeight={'37.488rem'}
          overflow={{y: 'auto'}}
          gap={'0.25rem'}
        >
          <i-hstack
            verticalAlignment='center' gap="0.5rem"
            border={{radius: '0.25rem'}}
            background={{color: Theme.background.modal}}
          >
            <i-icon
              name="paperclip"
              width={'0.75rem'} height={'0.75rem'}
              fill={Theme.text.primary}
              stack={{basis: '1.875rem', shrink: '0'}}
            ></i-icon>
            <i-input
              id="inputLink"
              width={'100%'} height={'2rem'}
              border={{style: 'none'}}
              background={{color: Theme.background.modal}}
              placeholder='Edit URL'
              font={{size: '0.75rem'}}
              onKeyUp={this.handleInput}
            ></i-input>
          </i-hstack>
          <i-hstack
            verticalAlignment='center' gap="0.5rem"
            border={{radius: '0.25rem'}}
            background={{color: Theme.background.modal}}
          >
            <i-icon
              name="paragraph"
              width={'0.75rem'} height={'0.75rem'}
              fill={Theme.text.primary}
              stack={{basis: '1.875rem', shrink: '0'}}
            ></i-icon>
            <i-input
              id="inputText"
              width={'100%'} height={'2rem'}
              border={{style: 'none'}}
              background={{color: Theme.background.modal}}
              placeholder='Edit Title'
              font={{size: '0.75rem'}}
              onKeyUp={this.handleInput}
            ></i-input>
          </i-hstack>
        </i-vstack>
      </i-modal>
    )
  }
}
