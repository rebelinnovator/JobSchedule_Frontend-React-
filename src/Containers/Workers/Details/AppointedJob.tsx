import React, { Component } from 'react';
import { jobAPI } from '../../../Services/API';
import { withRouter } from 'react-router';
import jobStore from '../../../Stores/jobStore';
import { observer } from 'mobx-react';
import CheckboxComponent from '../../Components/Controls/Checkbox.Component';
import JobItemSchedule from '../../Job/JobItemSchedule';
import { PagingComponent } from '../../Components';


@observer
class AppointedJob extends Component<any> {

  componentDidMount = () => {
    this.fetchWorkerJobs();
  };

  fetchWorkerJobs = async () => {
    const { id } = this.props.match.params;
    if (!id) return;
    await jobStore.getProjectsList({ workerId: id });
  };

  changedPage = async (page: number) => {
    const { id } = this.props.match.params;
    if (!id) return;
    await jobStore.getProjectsList({ workerId: id, page });
  };

  render() {
    return (
      <div>
        {jobStore.projects && jobStore.projects.map((project, indexP) => (
          <JobItemSchedule selectable={false} job={project} index={0} />
        ))}
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={jobStore.projectsLoader.total}
            onChangePage={this.changedPage}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(AppointedJob);
