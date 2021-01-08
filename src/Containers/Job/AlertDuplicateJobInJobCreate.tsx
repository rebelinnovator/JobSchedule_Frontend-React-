import React from 'react';
import { AssignWorker } from '../../Models';
// import { JobItem } from '../../Models/JobItem';
import './alertDuplicateJobInJobCreate.scss';
import JobItemSchedule from './JobItemSchedule';
import { observer } from 'mobx-react';
import { JobItem } from '../../Models/jobItem';
import Select from 'react-select';
import moment from 'moment';
import * as CeIcon from '../../Utils/Icon';
import { createBrowserHistory } from 'history';
interface Props {
  showed: boolean;
  listJobDuplicate?:any;
  save?:Function;
  close: Function;
//   updateWorkers?: Function;
//   removeWorker?: Function;
//   locations?: Array<LocationItem>;
}

@observer
export class AlertDuplicateJobInJobCreate extends React.Component<Props> {
  workers: Array<AssignWorker>;
  workersList: Array<any>;
  onlyAvailable: boolean;
  showWorkerAdd: boolean;
  selectedDate: Date;
  listJobDuplicate:Array<JobItem>;
//   locations: Array<LocationItem>;
  subcontractor: any;
  errors: any;

  constructor(props: any) {
    super(props);
  }

  state = {
    subcontractorName: null,
    status: 'active',
  };


  onRemove(index: number) {
    // this.props.closeSlide();
  }


  // selectSubcontractor
  public render() {
    return (
      <div className={`alert-container ${this.props.showed ? 'showed' : ''}`}>
        <div className="alert-content">
          <div className="alert-header d-flex align-items-center justify-content-between">
            <div className="alert-title"><span> Potential Duplicate job found for Conf (click for detail): </span>
            <br/><br/>
            <div>
            {
            this.props.listJobDuplicate && this.props.listJobDuplicate.map((project, indexP) => (
                // console.log(project)
                <a
                href ={'/job/'+project.id}
                target ="_blank"
                className="cursor-pointer"
                // onClick={() => {
                //     createBrowserHistory({ forceRefresh: true }).push(`/job/${project.id}`);
                //   }}
              >
                <span> {project.confirmNumber};   </span>
              </a>
              
            ))
          }
          </div>
          </div>
            <div className="cursor-pointer p-1">
              <CeIcon.Close
                onClick={() => {
                  this.props.close();
                }}
              />
            </div>
          </div>
          <div className="alert-body">
          {/* {
            this.props.listJobDuplicate && this.props.listJobDuplicate.map((project, indexP) => (
              <div className="box-item" key={`${project.id}-${indexP}`} >
                <div className="box-item-header d-flex justify-content-between align-items-center pr-0">
                  <div className="d-flex align-items-center">
                    <div className="number-of-item">
                      {Number(this.props.listJobDuplicate.includes(project.id))}
                    </div>
                  </div>
                  <div className="label-serial fs-14">
                    <span>PO#</span> {project.po}
                  </div>
                </div>
                <JobItemSchedule rerouteable job={project} index={0}  />
              </div>
            ))
          } */}
            <div className="alert-action">
              <div className="ce-alert-record">
                <button
                  className="btn btn-success btn-add cursor-pointer"
                  type={'button'}
                  onClick={() => {
                      this.props.save()
                    }}
                //   onClick={this.props.save}
                >
                  <span>Save Anyway</span>
                </button>
        {/* {
            this.props.listJobDuplicate && this.props.listJobDuplicate.map((project, indexP) => (
                // console.log(project)
                <a
                href ={'/job/'+project.id}
                target ="_blank"
                className="cursor-pointer"
                // onClick={() => {
                //     createBrowserHistory({ forceRefresh: true }).push(`/job/${project.id}`);
                //   }}
              >
                <span>ConfirmationNumber: {project.confirmNumber}  </span>
              </a>
              
            ))
          } */}
          <a
                  className="btn btn-outline-secondary btn-font-bold cursor-pointer"
                  onClick={() => {
                
                    this.props.close()
                  }}
                >
                  <span>Cancel</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AlertDuplicateJobInJobCreate;