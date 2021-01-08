import React from 'react';
// import "@technikhil/react-daterangepicker/styles.css";
// import "bootstrap/dist/css/bootstrap.css";

import CalendarIcon from '../../../Images/calendar.png';

interface Props {
  hasTitle?: string;
  onChange?: Function;
  readonly?: boolean;
  date?: any;
}
export class DateRangeComponent extends React.Component<Props> {
  date: any;
  constructor(props) {
    super(props);
    this.date = '';
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(date) {
    if (this.props.onChange) {
      this.props.onChange();
    }
    this.setState({
      date,
    });
    this.date = date;
  }

  public render() {
    return (
            <div className="ce-date">
                {
                    this.props.hasTitle &&
                    <span className="ce-title">{this.props.hasTitle}</span>
                }
                <div className="ce-date-control">
                    <img src={CalendarIcon} />
                </div>
            </div>
    );
  }
}

export default DateRangeComponent;
