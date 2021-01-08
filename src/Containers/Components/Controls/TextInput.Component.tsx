import * as React from 'react';

// import './date.scss';

interface Props {
  title?: string;
  onChange?: Function;
  checked?: boolean;
  className?: string;
  value?: string;
  name?: string;

}

export class CETextInputComponent extends React.Component<Props> {
  value: any;

  constructor(props) {
    super(props);
    this.value = this.props.value;
  }

  componentWillReceiveProps(nextProps) {
    this.value = nextProps.value;

  }

  public render() {
    return (
      <div className={this.props.className}>
        {
          this.props.title && <span className="ce-title">{this.props.title}</span>
        }

        <div className="ce-form-control">

          <input name={this.props.name} className="ce-input-control" value={this.value} onChange={(text) => {
            if (this.props.onChange) {
              this.props.onChange(text);
            }
          }}></input>

        </div>

      </div>

    );
  }
}

export default CETextInputComponent;
