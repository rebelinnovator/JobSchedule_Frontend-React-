import React from 'react';
import * as CeIcon from '../../Utils/Icon';
import moment from 'moment';
import { JobListItem } from '../../Models/jobListItem';
import { JOB_STATUSES } from '../../Constants/job';
import { DEPARTMENTS } from '../../Constants/user';
import UserSmallComponent from '../Components/UserSmallComponent/UserSmallComponent';

interface Props {
  job: JobListItem;
}

export class JobHistoryComponent extends React.Component<Props> {
  transformValue = (key, value) => {
    try {
      value = JSON.parse(value);
    } catch (error) {}

    let render: any = null;
    switch (key) {
      case 'requestTime':
        render = moment(value).format('DD:MM:YYYY hh:mm');
        break;
      case 'locations':
        render = Array.isArray(value)
          ? value.map((item) => item.address).join(', ')
          : null;
        break;
      case 'municipality':
        render = value ? value.label : null;
        break;
      case 'jobStatus':
        render = JOB_STATUSES[value];
        break;
      case 'department':
        const department = DEPARTMENTS.find((dep) => {
          return dep.id == value;
        });
        render = department ? department.name : '';
        break;
      case 'workers':
        render = Array.isArray(value)
          ? value
              .map((item) =>
                item.worker
                  ? `${item.worker.firstName} ${item.worker.lastName}`
                  : ''
              )
              .join(', ')
          : null;
        break;
      case 'requestor':
      case 'supervisor':
        // case 'requestor':
        render = <UserSmallComponent id={value} />;
        break;

      default:
        render = value || '';
        break;
    }

    return render || '-';
  };

  public render() {
    console.log('history: ', this.props.job.changesLog);
    
    return (
      <div className="box-item-body">
        <div className="actions-save-file">
          <a
            href="javascript:;"
            className="btn-save-file d-flex align-items-center"
          >
            <CeIcon.DownloadIcon className="mr-2" />
            <span>Save to PDF</span>
          </a>
        </div>
        <div className="job-history-page">
          {this.props.job.changesLog.map((log, index) => (
            <div key={index} className="job-history-item pb-3">
              <div className="timeline">
                <div className="date">
                  {moment(log.updatedAt).format('MM/DD/YY')}
                  <br />
                  {moment(log.updatedAt).format('HH:mm:ss')}
                </div>
                <div className="circle">
                  <div className="point"></div>
                </div>
              </div>
              <div className="job-history-item-content">
                <div className="mb-4">
                  <span className="mr-3">
                    <span className="text-bold">Source</span>:{' '}
                    {log.source ? log.source : 'Web'}
                  </span>
                  <br className="d-block d-md-none" />
                  <span className="text-bold">Change Made By</span>:{' '}
                  {log.updaterName ? log.updaterName : ''}
                </div>
                <div>
                  <table className="table table-history mb-0">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Old Value</th>
                        <th>New Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(log.fields) &&
                        log.fields.map((field) => (
                          <tr>
                            <td>{field.fieldName}</td>
                            <td>
                              {this.transformValue(
                                field.fieldName,
                                field.oldValue
                              )}
                            </td>
                            <td>
                              {this.transformValue(
                                field.fieldName,
                                field.newValue
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="job-history-line-timeline"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default JobHistoryComponent;
