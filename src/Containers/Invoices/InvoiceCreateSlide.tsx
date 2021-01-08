import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { JobType } from '../../Constants/job';
import closeRegular from '../../Images/close-regular.png';
import { BILLING_CYCLE, IInvoice, IPricing, PricingType, PRICING_TYPE } from '../../Models/invoiceItem';
import { invoiceAPI } from '../../Services/API';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import DepartmentAsyncSearch from '../Components/Controls/DepartmentAsyncSearch';
import RadioCustomComponent from '../Components/Controls/Radio.Component';
import DateComponent from '../Components/Date/Date.Component';


interface Props {
  showed: boolean;
  closeSlide: Function;
  updateInvoices: any;
}
const _state = {
  pricing: [],
  emails: [],

  billingCycle: BILLING_CYCLE.Monthly,
  date: null,

  onlyCompleted: false,
  useActualBreakTimes: false,
  ignoreBreaks: false,
  forceBreakValue: false,
  forceBreakTime: '00:30',
  departments: [],
};
export class AddInvoiceSliderComponent extends React.Component<Props> {
  state: IInvoice = _state;

  handleChangePricingTypeInput = (jobType: number) =>
    ({ currentTarget: { name, value, type } }) => {
      if (type === 'number') {
        return this.changePricingField(jobType, name, Number(value));
      }
      this.changePricingField(jobType, name, value);
    };

  findJobType = (type: number) => this.state.pricing.find(price => price.jobType === type);


  submit = async () => {
    await invoiceAPI.create(this.state);
    this.props.updateInvoices();
    this.props.closeSlide();
    this.setState({ ..._state })
  }

  renderPricingType(jobType, pricing: IPricing) {
    return (
      <div>
        {pricing.type === PRICING_TYPE.FLAT || pricing.type === PRICING_TYPE.MIXED ? (
          <div>
            <div className="form-group mt-3">
              <label id={`rate${jobType}`} className="d-block">Flat Rate</label>
              <input
                className="ce-form-control ce-form-price"
                name="flatRate"
                onChange={this.handleChangePricingTypeInput(jobType)}
                defaultValue={`${pricing.flatRate}`}
                type="number"
                id={'rate' + jobType} placeholder="$00" />
            </div>
          </div>) : null}
        {pricing.type === PRICING_TYPE.HOURLY || pricing.type === PRICING_TYPE.MIXED ? (
          <div className="d-flex justify-content-between">
            <div className="form-group mt-3">
              <label htmlFor={'rateStraightHours' + jobType} className="d-block">Rate(Straight Hours)</label>
              <input
                className="ce-form-control ce-form-price"
                name="straightHoursRate"
                id={'rateStraightHours' + jobType}
                defaultValue={`${pricing.straightHoursRate}`}
                onChange={this.handleChangePricingTypeInput(jobType)}
                placeholder="$00" />
            </div>
            <div className="form-group mt-3">
              <label htmlFor={'rateOtHours' + jobType} className="d-block">Rate(Ot Hours)</label>
              <input
                className="ce-form-control ce-form-price"
                name="otHoursRate"
                defaultValue={`${pricing.otHoursRate}`}
                onChange={this.handleChangePricingTypeInput(jobType)}
                placeholder="$00" />
            </div>
            <div className="form-group mt-3">
              <label
                htmlFor={'rateHolidayHours' + jobType}
                className="d-block">Rate(Holiday Hours)</label>
              <input
                className="ce-form-control ce-form-price"
                name="holidayHoursRate"
                defaultValue={`${pricing.holidayHoursRate}`}
                onChange={this.handleChangePricingTypeInput(jobType)}
                placeholder="$00" />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  changePricingType = (jobType, priceType) => {
    this.changePricingField(jobType, 'type', priceType);
  }

  changePricingField = (jobType, fieldName: string, value: any) => {
    this.handleChangeValue('pricing', this.state.pricing.map((price: IPricing) => {
      if (price.jobType === jobType) {
        return {
          ...price,
          [fieldName]: value,
        };
      }
      return price;
    }));
  }

  renderPricingOfJobType(jobType) {
    const pricing = this.findJobType(jobType);

    if (!pricing) return null;

    return (
      <div>
        <div className="slide-body-item-header">
          Pricing for {JobType[jobType]}
        </div>
        <div className="slide-body-item-content">
          <div className="d-flex justify-content-between">
            <RadioCustomComponent
              title={PricingType.Flat}
              id={`flat-${JobType[jobType]}`}
              name={`price-${jobType}`}
              checked={pricing.type === PRICING_TYPE.FLAT}
              onChange={() =>
                this.changePricingType(jobType, PRICING_TYPE.FLAT)} />
            <RadioCustomComponent
              title={PricingType.Hourly}
              id={`hourly-${JobType[jobType]}`}
              name={`price-${jobType}`}
              checked={pricing.type === PRICING_TYPE.HOURLY}
              onChange={() =>
                this.changePricingType(jobType, PRICING_TYPE.HOURLY)} />
            <RadioCustomComponent
              title={PricingType.Mixed}
              id={`mixed-${JobType[jobType]}`}
              name={`price-${jobType}`}
              checked={pricing.type === PRICING_TYPE.MIXED}
              onChange={() =>
                this.changePricingType(jobType, PRICING_TYPE.MIXED)} />
          </div>
          {this.renderPricingType(jobType, pricing)}
        </div>
      </div>
    );
  }

  handleChangeBillingType = (billingType: number) => () => {
    this.handleChangeValue('billingCycle', billingType);
  }

  handleInputChange = (event) => {
    const { name, value } = event.currentTarget;
    this.handleChangeValue(name, value);
  }

  handleChangeValue = (name, value) => {
    this.setState({ [name]: value });
  }

  initPricing = (jobType: number): IPricing => {
    return {
      jobType,
      type: PRICING_TYPE.FLAT,
      flatRate: 0,
      straightHoursRate: 0,
      otHoursRate: 0,
      holidayHoursRate: 0,
    };
  }

  toggleJobType = (jobType: number) => {
    const idx = this.state.pricing.findIndex(price => price.jobType === jobType);
    if (!(~idx)) {
      this.handleChangeValue('pricing', [...this.state.pricing, this.initPricing(jobType)]);
      return;
    }
    this.handleChangeValue('pricing', this.state.pricing.filter(price => price.jobType !== jobType))
  }

  renderJobType = (jobType: number) => (<button
    type="button"
    className={
      `btn ${(this.findJobType(jobType) ? 'active' : '')}`}
    onClick={() => this.toggleJobType(jobType)}>{JobType[jobType]}</button>)

  public render() {
    return (
      <div className={'slide-container ' + (this.props.showed ? 'showed' : '')}>
        <div className="slide-content">
          <div className="slide-header d-flex align-items-center justify-content-between">
            <div className="slide-title">
              Configuration
            </div>
            <img
              className="cursor-pointer p-1"
              onClick={() => {
                this.props.closeSlide()
                this.setState({ ..._state })
              }}
              src={closeRegular}></img>
          </div>
          <div className="slide-body">
            <div className="slide-body-item-content">
              <div className="btn-group group-job-type w-100" role="group">
                {this.renderJobType(JobType.Flagging)}
                {this.renderJobType(JobType.Parking)}
                {this.renderJobType(JobType.Signage)}
              </div>
            </div>

            {/* {this.renderPricingOfJobType(JobType.Flagging)}
            {this.renderPricingOfJobType(JobType.Parking)}
            {this.renderPricingOfJobType(JobType.Signage)} */}

            <div className="slide-body-item-content border-top">
              <div className="form-group">
                <label htmlFor="department" className="d-block">Departments</label>
                <DepartmentAsyncSearch
                  isMulti
                  onSelect={departments =>
                    this.handleChangeValue('departments', Array.isArray(departments) ?
                      departments.map(department => department.value.id) :
                      [])
                  } />
              </div>
            </div>

            <div>
              <div className="slide-body-item-header">
                Set billing cycle
              </div>
              <div className="slide-body-item-content">
                <div className="d-flex justify-content-between">

                  <RadioCustomComponent
                    title="Weekly"
                    name="billingcycle"
                    id="Weekly"
                    checked={this.state.billingCycle === BILLING_CYCLE.Weekly}
                    onChange={this.handleChangeBillingType(BILLING_CYCLE.Weekly)} />
                  <RadioCustomComponent
                    title="Monthly"
                    id="Monthly"
                    name="billingcycle"
                    checked={this.state.billingCycle === BILLING_CYCLE.Monthly}
                    onChange={this.handleChangeBillingType(BILLING_CYCLE.Monthly)} />
                  <RadioCustomComponent
                    title="Daily"
                    id="Daily"
                    name="billingcycle"
                    checked={this.state.billingCycle === BILLING_CYCLE.Daily}
                    onChange={this.handleChangeBillingType(BILLING_CYCLE.Daily)} />
                </div>

                <div className="form-group mt-3 w-50 ce-date">
                  <CheckboxComponent
                    hasTitle="Set specific date and time"
                    id="useactualBreakTimes"
                    checked={Boolean(this.state.date)}
                    onChange={checked =>
                      this.handleChangeValue('date', checked ? new Date() : null)}
                    className="mb-2" />
                  {Boolean(this.state.date) ? <>
                    <label htmlFor="date" className="d-block">Date</label>
                    <DateComponent
                      date={this.state.date}
                      onChange={date => this.handleChangeValue('date', date)} />
                  </> : null}
                </div>
              </div>
            </div>

            <div>
              <div className="slide-body-item-header">
                Worker breaks invoicing options
              </div>
              <div className="slide-body-item-content">
                <CheckboxComponent
                  hasTitle="Use Actual Break Times"
                  id="useactualBreakTimes"
                  checked={this.state.useActualBreakTimes}
                  onChange={checked => this.handleChangeValue('useActualBreakTimes', checked)}
                  className="mb-2" />
                <CheckboxComponent
                  hasTitle="Completed Jobs Only"
                  id="completedJobsOnly"
                  checked={this.state.onlyCompleted}
                  onChange={checked => this.handleChangeValue('onlyCompleted', checked)}
                  className="mb-2" />
                <CheckboxComponent
                  hasTitle="Ignore Breaks"
                  checked={this.state.ignoreBreaks}
                  onChange={checked => this.handleChangeValue('ignoreBreaks', checked)}
                  id="ignoreBreaks" />

                <div className="d-flex align-items-center force-break-value-invoice">
                  <CheckboxComponent
                    checked={this.state.forceBreakValue}
                    onChange={checked =>
                      this.handleChangeValue('forceBreakValue', checked)}
                    hasTitle="Force Break Value for Invoice: "
                    id="forceBreakValueforInvoice"
                    className="mr-4" />
                  <input
                    className="ce-form-control w-25"
                    name={'forceBreakTime'}
                    type={'time'}
                    defaultValue={this.state.forceBreakTime}
                    onChange={this.handleInputChange}
                    placeholder="30 min" />
                </div>
              </div>
            </div>

            <div className="border-bottom">
            </div>

            <div className="slide-body-item-content">
              <div className="form-group">
                <label className="d-block" htmlFor="exceltemplate">Excel Template</label>
                <Select
                  options={[{ label: 'Exel Tamplate 1', value: 1 }]}
                  onChange={(tamplate: any) =>
                    this.handleChangeValue('exel_tamplate', tamplate.value)} />
              </div>
            </div>
            <div className="border-bottom">
            </div>
            <div className="slide-body-item-content">
              <div className="form-group">
                <label className="d-block" htmlFor="emailto">Email to</label>
                <CreatableSelect
                  isMulti
                  isClearable
                  name="emails"
                  formatCreateLabel={email => `Send email to ${email}`}
                  onChange={emails =>
                    this.handleChangeValue('emails', Array.isArray(emails) ?
                      emails.map(email => email.value) : [])}
                />
              </div>
              <div className="form-group mt-4 mb-3">
                <button type="button" onClick={this.submit} className="btn btn-primary w-100">Create Invoice</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
