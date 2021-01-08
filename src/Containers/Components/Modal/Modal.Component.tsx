import React from 'react';

interface Props {
  show: boolean;
  onClose: Function;
  size?: string; // modal-lg, modal-sm, modal-md
  header?: any;
  footer?: any;
  className?:string;
}

class CEModal extends React.Component<Props> {

  renderHeader() {
    if (this.props.header) {
      return (
        <div className="modal-header">
          <h4>{this.props.header}</h4>
          <span className="close" onClick={() => this.props.onClose()}>&times;</span>
        </div>
      );
    }
  }

  renderBody() {
    if (this.props.children) {
      return (
        <div className="modal-body">
          {this.props.children}
        </div>
      );
    }
  }

  renderFooter() {
    if (this.props.footer) {
      return (
        <div className="modal-body">
          {this.props.footer}
        </div>
      );
    }
  }
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className={'modal-custom ' + this.props.className}>
        <div className={'modal ' + (this.props.show ? 'show' : '')}>
          <div className={'modal-content ' + this.props.size}>
            {this.props.header && this.renderHeader()}
            {this.renderBody()}
            {this.props.footer && this.renderFooter()}
          </div>
        </div>
      </div>
    );
  }
}

export default CEModal;
