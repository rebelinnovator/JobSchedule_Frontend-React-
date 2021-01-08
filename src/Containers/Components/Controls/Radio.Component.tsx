import * as React from 'react';

// import './date.scss';

interface Props {
  title?: string;
  onChange?: Function;
  checked?: boolean;
  className?: string;
  id: string;
  name?: string;
}

export class RadioCustomComponent extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={'custom-control custom-radio ' + this.props.className}>
        <input type="radio" className="custom-control-input" id={this.props.id} name={this.props.name}
               checked={this.props.checked} onChange={() => {
          if (this.props.onChange) {
            this.props.onChange();
          }
        }}>
        </input>
        <label className="custom-control-label" htmlFor={this.props.id}>{this.props.title}</label>
      </div>
    );
  }
}

export default RadioCustomComponent;
