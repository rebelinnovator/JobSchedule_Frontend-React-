import * as React from 'react';
import * as CEIcon from '../../../Utils/Icon';
import './CheckboxComponent.scss';

interface Props {
  name?: string;
  hasTitle?: string;
  onChange?: Function;
  checked?: boolean[];
  className?: string;
  classNameIcon?: string;
  id: any;
  skipReceiveProps?: boolean;
}

export class DoubleCheckboxComponent extends React.Component<Props> {
  checked: boolean[] = this.props.checked;

  constructor(props) {
    super(props);
    this.state = {
      checked: [false, false],
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
        className={'ce-chk-control ml-0 ' + this.props.className}
      >
        <label className="ce-title no-margin" htmlFor={this.props.id}>
          {
            this.props.hasTitle &&
            <span className="ce-ml-10">{this.props.hasTitle}</span>
          }
        </label>
        <div className="checkbox-section mr-4">
          {
            this.checked[0]
              ? <CEIcon.CheckedIcon onClick={() => {
                this.checked[0] = false; this.props.onChange(this.checked);
              }} className={this.props.classNameIcon} height={20} width={20} />
              : <CEIcon.UnCheckIcon onClick={() => {
                this.checked[0] = true; this.props.onChange(this.checked);
              }} className={this.props.classNameIcon} height={20} width={20} />
          }

          {
            this.checked[1]
              ? <CEIcon.CheckedIcon onClick={() => {
                this.checked[1] = false; this.props.onChange(this.checked);
              }} className={this.props.classNameIcon} height={20} width={20} />
              : <CEIcon.UnCheckIcon onClick={() => {
                this.checked[1] = true; this.props.onChange(this.checked);
              }} className={this.props.classNameIcon} height={20} width={20} />
          }
        </div>
      </div>
    );
  }
}

export default DoubleCheckboxComponent;
