import {
  customElements,
  ControlElement,
  Styles,
  Module,
  Container,
  Panel,
  application
} from '@ijstech/components';

enum ModeType {
  LIVE = "Live",
  SNAPSHOT = "Snapshot"
}

interface IChartConfig {
  name?: string;
  dataSource: string;
  queryId?: string;
  apiEndpoint?: string;
  title: string;
  description?: string;
  options: any, // ChartOptions
  file?: {
    cid: string,
    name: string
  },
  mode: ModeType
}

interface ScomEditorChartElement extends ControlElement {
  data: IChartConfig;
}

const DefaultData = {
  name: 'scom-line-chart',
  dataSource: 'Dune',
  queryId: '',
  apiEndpoint: '',
  title: '',
  options: undefined,
  mode: ModeType.LIVE
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-editor-chart']: ScomEditorChartElement;
    }
  }
}

@customElements('i-scom-editor-chart')
export class ScomEditorChart extends Module {
  private chartWrapper: Panel;
  private chartEl: any;

  private _data: IChartConfig = DefaultData;
  private currentType: string = '';

  static async create(options?: ScomEditorChartElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  getData() {
    return this._data;
  }

  async setData(data: IChartConfig) {
    this._data = data;
    await this.renderChart();
  }

  getChartElm() {
    return this.chartEl;
  }

  private async renderChart() {
    const { name } = this._data;
    if (!this.chartEl || (this.chartEl && name !== this.currentType)) {
      this.chartEl = await application.createElement(name);
      this.currentType = name;
      this.chartWrapper.clearInnerHTML();
      this.chartWrapper.appendChild(this.chartEl);
    }
    await this.chartEl.setData(JSON.parse(JSON.stringify(this._data)));
  }

  getConfigurators() {
    return [
      {
        name: 'Editor',
        target: 'Editor',
        getActions: this.getActions.bind(this),
        getData: this.getData.bind(this),
        setData: this.setData.bind(this)
      }
    ]
  }

  private getActions() {
    if (this.chartEl?.getConfigurators) {
      const configs = this.chartEl.getConfigurators() || [];
      const configurator = configs.find((conf: any) => conf.target === 'Builders');
      const action = configurator?.getActions && configurator.getActions().find((action: any) => action.name === 'Data');
      return action ? [action] : [];
    }
    return [];
  }

  async init() {
    super.init();
    const data = this.getAttribute('data', true);
    if (data) await this.setData(data);
  }

  render(): void {
    return (
      <i-panel id="chartWrapper"></i-panel>
    )
  }
}
