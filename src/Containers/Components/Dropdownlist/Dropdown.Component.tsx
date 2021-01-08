import * as React from 'react';
import './style.scss';
import ChevronDown from '../../../Images/chevron-down.png';
import * as CeIcon from '../../../Utils/Icon';
import CheckboxComponent from '../Controls/Checkbox.Component';

interface Props {
  hasSearch?: boolean;
  sources?: Array<any>;
  placeHolder?: string;
  displayName?: string;
  displayValue?: string;
  className?: string;
  renderType?: any;
  multiSelect?: boolean;
  onSelect?: Function;
  selected?: any;

}
export class DropdownComponent extends React.Component<Props> {
  selected: any;
  id: string;
  checked: boolean = false;
  hiddenCsss: string = 'ce-dropdown-scroll';
  dropdown: boolean;
  constructor(props) {
    super(props);
    this.onDropdown = this.onDropdown.bind(this);
    this.onCheckBok = this.onCheckBok.bind(this);
    if (this.props.multiSelect) {
      this.selected = new Array<any>();
    }
    const currentDate = new Date();
    this.id = `chk${currentDate.getTime()}`;
    this.dropdown = false;
    if (this.props.selected !== undefined && this.props.selected !== this.selected) {
      this.selected = this.props.selected;
    }
  }
  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.selected !== undefined && nextProps.selected !== this.selected) {
      this.selected = nextProps.selected;
    }
  }
  componentDidMount() {
    const self = this;

    document.addEventListener('click', function (event) {

      if (event.toElement && ((event.toElement
        && event.toElement.hasAttribute('id')
        && event.toElement.getAttribute('id').indexOf(self.id) != -1)
        || (event.toElement.parentElement
          && event.toElement.parentElement.hasAttribute('id')
          && event.toElement.parentElement.getAttribute('id').indexOf(self.id) != -1))) {
        // self.dropdown = true;
        if (self.checked) {
          self.hiddenCsss = 'ce-dropdown-scroll visible';
        }
        else {
          self.hiddenCsss = 'ce-dropdown-scroll';
        }
      }
      else {
        if (self.props.renderType == 'chk' && self.props.multiSelect) {
          if (event.toElement && event.toElement.hasAttribute('class')) {
            const cssList = 'ce-ml-10,ce-chk-control,ce-dropdown-scroll';
            if (cssList.split(',').indexOf(event.toElement.getAttribute('class')) != -1) {
              return;
            }
          }

          self.dropdown = false;
          self.checked = false;

          self.hiddenCsss = 'ce-dropdown-scroll';

        }
      }

      self.setState({ change: true });
    });

  }
  onDropdown = (dropdown: boolean) => {
    if (this.props.multiSelect) {
      this.checked = true;
    }
    else {
      this.checked = !this.checked;
    }
    if (dropdown) {
      this.hiddenCsss = 'ce-dropdown-scroll visible';
    }
    else {
      this.hiddenCsss = 'ce-dropdown-scroll';
    }
    this.setState({ change: true });
  }
  onCheckBok = (item) => {

    if (this.props.multiSelect) {
      if (item.checked) {
        item.checked = false;
        this.selected = this.selected as Array<any>;
        const hasIndex =
          this.selected.findIndex(e => e[this.props.displayValue] == item[this.props.displayValue]);
        if (hasIndex != -1) {
          this.selected.splice(hasIndex, 1);
        }
      }
      else {
        item.checked = true;
        this.selected.push(item);
      }
    }
    else {
      this.selected = item;
    }

    this.setState({ change: true });
    if (this.props.onSelect) {
      this.props.onSelect(this.selected);
    }
  };
  propertyDisplay(item: any) {
    if (this.props.displayName != undefined) {
      if (item[this.props.displayName] != undefined) {
        return item[this.props.displayName].toString();
      }
      return ' ';
    }

    return item.toString();

  }
  displayText() {
    let text = '';
    if (this.props.multiSelect) {
      this.selected.forEach((element, index) => {
        text += this.props.displayName ? element[this.props.displayName] : element;
        text += ', ';
      });
      text = text.trimEnd();
      text = text.substring(0, text.length - 1);
    }
    else {
      text = this.props.displayName ? this.selected[this.props.displayName] : this.selected;
    }
    return text;
  }

  public render() {
    return (
      <div
        className={`ce-dropdown-control cursor-pointer ${this.props.className}`}
        onClick={() => {
          this.onDropdown(true);
        }} >
        <div className="ce-dropdown" id={this.id} >
          <div>
            {
              !this.selected ?
                <span className={this.props.className}>
                  {this.props.placeHolder}
                </span> :
                <span>{this.displayText()}</span>
            }

          </div>
          <a className="icon-dropdown" onClick={() => {
            this.onDropdown(true);
          }}>
            <CeIcon.ChevronDownIcon className="ml-3" />
          </a>

        </div>
        {
          this.checked &&

          <div className={this.hiddenCsss}>
            {
              this.props.hasSearch &&
              <div className="ce-form-control">
                <img src={ChevronDown}></img>
                <input className="ce-input-control" ></input>

              </div>
            }
            {
              this.props.renderType == 'chk' && this.props.sources.length > 0
              && this.props.sources && this.props.sources.map((item, index) => (
                <CheckboxComponent
                  key={`dropdown${this.id}${index}`}
                  hasTitle={this.propertyDisplay(item)}
                  checked={item.checked} id={index} onChange={() => {
                    this.onCheckBok(item);
                  }} />
              ))
            }
            {
              !this.props.renderType && this.props.sources
              && this.props.sources.length > 0
              && this.props.sources.map((item, index) => (
                <div
                  key={`dropdown${this.id}${index}`}
                  className="ce-dropdown-item" onClick={() => {
                    this.selected = item;
                    this.setState({ change: true });
                    if (this.props.onSelect) {
                      this.props.onSelect(this.selected);
                    }
                  }}>

                  {
                    this.propertyDisplay(item)
                  }

                </div>
              ))
            }
          </div>
        }
      </div>
    );
  }
}

export default DropdownComponent;
