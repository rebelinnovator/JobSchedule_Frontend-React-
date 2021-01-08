import * as React from 'react';
import './date.scss';
import CalendarIcon from '../../../Images/calendar.png';
import ClearIcon from '../../../Assets/clear.png';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';

interface Props {
  hasTitle?: string;
  onChange?: Function;
  readonly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  minTime?: string;
  date?: any;
  disabled?: boolean;
  showTimeSelect?: boolean;
  format?: string;
  clearIcon?: boolean;
  noDefault?: boolean;
}
var timeFormat="HH:mm";
function getSelectionString() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.getSelection().toString();
}

  
function makeOnKeyPress(maxLength) {

  return function onKeyPress(event) {
    const { value } = event.target;
    //alert(value);
    console.log(value);
    const selection = getSelectionString();
    //alert(value);
    if (selection || value.length < maxLength) {
      return;
    }

    event.preventDefault();
  };
}
function format(maxLength) {
  return timeFormat;
}
function makeOnKeyDown(maxLength) {

  return function onKeyDown(event) {
    const { value } = event.target;
    const selection = getSelectionString();
    if (selection || value.length < maxLength ) {
      return;
    }

    event.preventDefault();
  };
}
export class DateComponent extends React.Component<Props> {
  state={
    hour:0,
    min:0
  }
  static defaultProps = {
    format: 'datetime',
    defaultValue: new Date(),
    clearIcon: false,
  };

  date: Date;
  time: string;
  hour:number;
  min:number;
  constructor(props) {
    super(props);
    if (this.props.noDefault !== true) {
      this.date = new Date();
    }
    this.time = '';
    if (this.props.date) {
      this.date = this.props.date;
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    //debugger;
    if(this.date){
      this.hour=this.date.getHours();
      this.min=this.date.getMinutes();
    }
    else{
      this.hour=0;
      this.min=0;
    }    
    this.setState({hour:this.hour});
    this.setState({min:this.min});
  }

  handleChange(date) {
    //debugger;
    if (this.props.onChange) {
      this.props.onChange(date);
    }
    if (this.time) {
      const hour = this.time.split(':')[0];
      const min = this.time.split(':')[1];
      date.setHours(hour, min);
    }
    this.date = date;
  }

  handleChangeTime(time) {
    //alert(this.hour);
    //debugger;
    console.log(time);
    
    //test = time;
    if (time) {
      let hour = time.split(':')[0];
      let min = time.split(':')[1];
      //alert(min);
      // if(min.length<2){
      //   timeFormat="HH:mm";
      // }else{
      //   timeFormat="HH:m";
      // }
      timeFormat="HH:m";
      this.time = time;
      if (this.date) {
        this.date.setHours(hour, min);
        if (this.props.onChange) {
          this.props.onChange(this.date);
        }
      }
    }
    
  }
  // handleChangeField(name) {
  //   return event => {
  //     let {
  //       currentTarget: { value, type, dataset }
  //     } = event;
  //     if (type === 'number' || dataset.type === 'number') {
  //       return this.props.setFieldValue(name, Number(value), false);
  //     }
  //     return this.props.setFieldValue(name, value, false);
  //   };
  // }
  
  handleChangeHour = (hour: number) =>{
    console.log(hour);
    // debugger;
    // if(this.state.hour>24){
    //   this.setState({hour:24});
    // }
    // if(this.state.hour<0){
    //   this.setState({hour:0});
    // }
  }
  handleChangeMin(min){
    // debugger;
    // if(this.state.min>59){
    //   this.setState({hour:24});
    // }
    // if(this.state.min<0){
    //   this.setState({hour:24});
    // }
  }
  componentWillReceiveProps(nextProps) {
    this.date = nextProps.date;
  }

  renderComponent = () => {
    if (this.props.format === 'date') {
      return <DatePicker
        className="ce-date-input"
        value={this.date}
        onChange={this.handleChange}
        // monthPlaceholder={date.month()}
        // yearPlaceholder={date.year()}
        // dayPlaceholder={}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        clearIcon={this.props.clearIcon ? <img src={ClearIcon} className="clear-icon" /> : null}
        disabled={this.props.disabled}
        calendarIcon={<img src={CalendarIcon} />}
      />;
    }

    if (this.props.format === 'time') {
      return <TimePicker
        className="ce-date-input"
        value={this.date}
        onChange={this.handleChange}
        minDate={this.props.minDate}
        minTime={this.props.minTime}
        maxDate={this.props.maxDate}
        format="HH:mm"
        // clearIcon={this.props.clearIcon}
        disableClock={true}
        disabled={this.props.disabled}
        clearIcon={this.props.clearIcon ? <img src={ClearIcon} className="clear-icon" /> : null}
        calendarIcon={<img src={CalendarIcon} />}
      />;
    }

    if (this.props.showTimeSelect) {
      let {
        hour,
        min
      } = this.state;
      return (
        <div className="datetime-picker__wrapper">
          <DatePicker
            value={this.date}
            onChange={this.handleChange}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            clearIcon={this.props.clearIcon ? <img src={ClearIcon} className="clear-icon" /> : null}
            disabled={this.props.disabled}
            calendarIcon={<img src={CalendarIcon} />}
          />
          <TimePicker
            value={this.date}
            onChange={this.handleChangeTime}
            //onKeyDown={format(2)}
            minDate={this.props.minDate}
            minTime={this.props.minTime}
            maxDate={this.props.maxDate}
            format={timeFormat}
            precision="minute"
            disableClock={true}
            disabled={this.props.disabled}
            clearIcon={this.props.clearIcon ? <img src={ClearIcon} className="clear-icon" /> : null}
          />
          
          {/* <div className="react-time-picker react-time-picker--open react-time-picker--enabled">
            <div className="react-time-picker__wrapper">
              <div className="react-time-picker__inputGroup">   
              <input
                      className="ce-form-control"
                      placeholder="Section Name"
                      defaultValue={this.filedValue('section')}
                      onChange={this.handleChangeField('section')}
                    />            
                <input                   
                  className="react-time-picker__inputGroup__input react-time-picker__inputGroup__hour"                  
                  data-type={'number'}
                />
                <span className="react-time-picker__inputGroup__divider">:</span>
                <input className="react-time-picker__inputGroup__input react-time-picker__inputGroup__minute" max="59" min="0" name="minute" placeholder="--" type="number" value={this.min}></input>
              </div>
            </div>
          </div> */}
        </div>
      );
    }

    return <DatePicker
      className="ce-date-input"
      value={this.date}
      onChange={this.handleChange}
      minDate={this.props.minDate}
      maxDate={this.props.maxDate}
      clearIcon={this.props.clearIcon ? <img src={ClearIcon} className="clear-icon" /> : null}
      disabled={this.props.disabled}
      calendarIcon={<img src={CalendarIcon}

      />}
    />;
  }

  public render() {
    return (
      <div className="ce-date">
        {this.props.hasTitle && (
          <span className="ce-title">{this.props.hasTitle}</span>
        )}
        {this.renderComponent()}
      </div>
    );
  }
}

export default DateComponent;
