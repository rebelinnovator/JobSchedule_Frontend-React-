import React from 'react';
import DateComponent from '../Date/Date.Component';

import LocationIcon from '../../../Images/location.png';
import WorkerIcon from '../../../Images/worker.png';

import * as CeIcon from '../../../Utils/Icon';
import { AssignWorker } from '../../../Models/assignWorker';
import './workercalendar.scss';
import { LocationItem } from '../../../Models/locationItem';
interface Props {
  showed: boolean;
  closeSlide: Function;
}

export class WorkerListSideComponent extends React.Component<Props> {
  workers: Array<any>;
  constructor(props: any) {
    super(props);
    this.workers = new Array<any>();
    this.addWorker();
    this.addWorker();
  }
  addWorker() {
    const currentDate = new Date();
    const location = new LocationItem();
    this.workers.push({
      location,
      worker: 'Steven Lee',
      startDate: currentDate,
    } as AssignWorker);
  }
  public render() {
    return (
      <div className={`slide-container ${(this.props.showed ? 'showed' : '')}`}>
        <div className="slide-content">
          <div className="slide-header">
            <div className="slide-title">
              04/04/2019 3 Workers
              <CeIcon.Close onClick={() => { this.props.closeSlide(); }} />

            </div>
          </div>
          <div className="slide-body">

            {
              this.workers.map((item, index) => (
                <div className={index == this.workers.length - 1 ? 'worker-row-item-last' : 'worker-row-item'}>
                  <div className="ce-assign-worker-calendar">
                    <div className="ce-assign-worker-schedule-action ">
                      <div>
                        <img src={WorkerIcon} />
                        <span>{item.worker}</span>
                      </div>
                      <div className="cursor-pointer" onClick={() => {

                      }} ><img src={CeIcon.TrashIcon} className="ce-mr-10" />Delete</div>
                    </div>
                    <div>
                      <img src={CeIcon.MapPinIconPNG} className="ce-mr-10" />
                      <span>{item.locations ? item.locations[0] : null}</span>
                    </div>
                  </div>
                  <div>
                    <div className="ce-assign-worker-item-header">
                      <span>Scheduled time</span>
                    </div>
                    <div className="ce-assign-worker-item-schedule">
                      <div className="work-time-start-date">
                        <DateComponent hasTitle="Start Date" />
                      </div>
                      <div>
                        <span className="ce-title">Start Time</span>
                        <div className="work-time-start-time">
                          <div className="ce-form-control">
                            <input className="ce-input-control" ></input>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }

            <div className="worker-action">
              <div className="ce-assign-worker-record">
                <a className="btn ce-btn-success cursor-pointer"><span>Assign Worker</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
