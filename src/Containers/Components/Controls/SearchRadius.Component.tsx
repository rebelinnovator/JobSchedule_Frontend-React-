import * as React from 'react';
import './search-radius.scss';
import * as CeIcon from '../../../Utils/Icon';

interface Props {
  title?: string;
  onChange?: Function;
  onChangeType?: Function;
  checked?: boolean;
  className?: string;
  value?: any;

}

export class CETSearchRadiusComponent extends React.Component<Props> {
  visible: boolean;
  items: Array<any>;
  itemSelected: any;

  constructor(props) {
    super(props);
    this.items = new Array<any>();
    this.items.push({
      id: 'Mil',
      label: 'Mil',
      state: 1.609344,
    });
    this.items.push({
      id: 'Km',
      label: 'Km',
      state: 1,
    });
  }

  componentDidMount() {
    const self = this;

    document.addEventListener('click', function (event) {

      if ((event.toElement && event.toElement.hasAttribute('class') && event.toElement.getAttribute('class').indexOf('ce-search-picker ') != -1)
        || (event.toElement.parentElement && event.toElement.parentElement.hasAttribute('class')
          && event.toElement.parentElement.getAttribute('class').indexOf('ce-search-picker ') != -1)) {

        self.visible = true;
      } else {
        self.visible = false;
      }
      self.setState({ change: true });

    });
  }

  renderMenu(items: any) {
    const myStyle = {
      position: 'absolute',
      'margin-top': '70px',
      'align-self': 'flex-end',
      zIndex: 1000,

    } as React.CSSProperties;

    return <div className="custom-context" style={myStyle}>

      {
        items.map((item, index, arr) => {
          return <div key={index} className="custom-context-item-last" onClick={() => {
            this.itemSelected = item;
            if (this.props.onChangeType) {
              this.props.onChangeType(this.itemSelected.state);
            }
          }}>
            <div className="content-item">
              {item.label} <CeIcon.ChevronDownIcon /></div>
          </div>;
        })
      }
    </div>;
  }

  public render() {
    return (
      <div className={'ce-search-radius ' + this.props.className}>
        {
          this.props.title && <span className="ce-title">{this.props.title}</span>
        }

        <div className="ce-search-radius-control">
          <div className="ce-search-input">
            <input className="ce-input-control" value={this.props.value} onChange={(e) => {
              if (this.props.onChange) {
                this.props.onChange(e.currentTarget.value);
              }
            }}></input>
          </div>
          <div className="ce-search-separator"></div>
          <div className="ce-search-picker cursor-pointer">
            <span>{this.itemSelected == undefined ? '' : this.itemSelected.label}</span>
            <CeIcon.ChevronDownIcon onClick={() => {

            }} />
          </div>

        </div>
        {
          this.visible && this.renderMenu(this.items)
        }
      </div>

    );
  }
}

export default CETSearchRadiusComponent;
