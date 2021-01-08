import * as React from 'react';
import * as CEIcon from '../../../Utils/Icon';
import './CheckboxComponent.scss';

interface Props {
  name?: string;
  hasTitle?: string;
  onChange?: Function;
  checked?: boolean;
  className?: string;
  classNameIcon?: string;
  id: any;
  skipReceiveProps?: boolean;
}

export class CheckboxComponent extends React.Component<Props> {
  checked: boolean = this.props.checked;

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.skipReceiveProps) {
      this.checked = nextProps.checked;
      this.setState({ change: true });
    }
  }

  public render() {
    return (
      <div
        className={'ce-chk-control cursor-pointer ml-0 ' + this.props.className}
        onClick={(e) => {
          e.stopPropagation();
          this.checked = !this.checked;
          this.setState({ checked: true });
          if (this.props.onChange) {
            this.props.onChange(this.checked);
          }
        }
        }>
        {
          this.checked
            ? <CEIcon.CheckedIcon className={this.props.classNameIcon} height={20} width={20} />
            : <CEIcon.UnCheckIcon className={this.props.classNameIcon} height={20} width={20} />
        }

        <label className="ce-title no-margin" htmlFor={this.props.id}>
          {
            this.props.hasTitle &&
            <span className="ce-ml-10">{this.props.hasTitle}</span>
          }
        </label>
      </div>
    );
  }
}

export default CheckboxComponent;
