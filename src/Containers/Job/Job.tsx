import * as React from 'react';
import { observer } from 'mobx-react';

import jobStore from '../../Stores/jobStore';
import * as CeIcon from '../../Utils/Icon';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import CEModal from '../Components/Modal/Modal.Component';
import FilterComponent from '../Searchs/Filter.Component';
import JobItemSchedule from './JobItemSchedule';
import PagingComponent from '../Components/Paging/PagingComponent';
import './Job.scss';
import { EROLES } from '../../Constants/user';
import authStore from '../../Stores/authStore';

@observer
export class Job extends React.Component {
  state: any;
  jobList: boolean;
  isToggleModal: boolean;
  loadLast = false;

  constructor(props) {
    super(props);
    this.state = {
      searchParams: { page: 0 },
      page: 0,
      po: 100101,
    };

  }

  componentDidMount() {

  }

  componentDidUpdate() {
    if ((this.props as any).location.state && (this.props as any).location.state.new && !this.loadLast) {
      if (jobStore.projectsLoader.total > 0) {
        const totalPage = Math.floor(jobStore.projectsLoader.total / 10) + (jobStore.projectsLoader.total % 10 === 0 ? 0 : 1);
        this.loadLast = true;
        this.changedPage(totalPage);
      }
    }
  }

  showModal() {
    if (!Array.isArray(jobStore.selectedJobs) || !jobStore.selectedJobs.length) {
      alert('Please select any job');
      return;
    }
    this.isToggleModal = true;
    this.setState({ change: true });
  }

  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
  }

  updatePo = async (event) => {
    event.preventDefault();
    await jobStore.updatePOsFromModal(this.state.po);
    this.closeModal();
  };

  search = async (params: any, keepPage = false) => {
    const searchParams = { ...params, ...!keepPage && { page: 0 } };
    this.setState({ searchParams });
   await jobStore.getProjectsList(searchParams);
  }

  changedPage = (page: number) => {
    this.setState({
      searchParams: { ...this.state.searchParams, page: page },
      page: page
    });
    jobStore.getProjectsList({ ...this.state.searchParams, page: page });
  }

  isSuperVisor() {
    const user = JSON.parse(localStorage.getItem('CurrentUser'));
    if (user.roles && user.roles.includes(EROLES.coned_field_supervisor)) {
      return true;
    }
    return false;
  }

  public render() {
    console.log('searchParams: ', this.state.searchParams);
    const hasSupervisor = this.isSuperVisor();
    return (
      <div className="d-flex App-content">
        <div className="col-left border-right">
          <FilterComponent
            hasDepartment={true}
            hasRequestDate={true}
            hasJobStatus={true}
            hasWorker={true}
            hasRequestor={true}
            hasFieldSupervisor={hasSupervisor}
            showFilter
            hasSort
            search={this.search}
            onFilter={() => {
              this.jobList = true;
              this.setState({ change: true });
            }}
          />
        </div>
        <div className="col-right job-list-page">
          {authStore.canDoJobAction() &&
            <div className="page-actions mb-3 d-flex justify-content-end">
              <a
                className="btn btn-outline-secondary mr-2"
                href="#"
                onClick={() => this.showModal()}
              >Update PO#</a>
              <a className="btn btn-success btn-add" href="/job/create">Create Job</a>
            </div>}

          <CEModal
            className="update-job-modal"
            size="ce-modal-content"
            show={this.isToggleModal}
            onClose={() => this.closeModal()}
          >
            <form onSubmit={this.updatePo}>
              <div className="ce-align-flex" >
                <span>Update PO #</span>
                <a className="pull-right" href="javascript:;" onClick={() => {
                  this.closeModal();
                }}>
                  <CeIcon.Close />
                </a>
              </div>
              <div className="modal-job-content">
                <div className="form-group">
                  <label className="d-block" htmlFor="newPO">New PO #</label>
                  <input
                    className="ce-form-control"
                    id="newPO"
                    name="newPO"
                    onChange={event => this.setState({ po: Number(event.target.value) })}
                    // onChange={this.onPoChange}
                    placeholder="000000"
                  />
                </div>
                <div className="text-center mt-4 mb-3">
                  <button type="submit" className="btn btn-primary w-100">Update</button>
                </div>
              </div>
            </form>
          </CEModal>
          {
            jobStore.projects && jobStore.projects.map((project, indexP) => (
              <div className="box-item" key={`${project.id}-${indexP}`} >
                <div className="box-item-header d-flex justify-content-between align-items-center pr-0">
                  <div className="d-flex align-items-center">
                    <CheckboxComponent
                      onChange={() => jobStore.toggleJobs([project.id])}
                      className="title-project mb-0 mr-3"
                      id={`title-${indexP}`}
                      checked={jobStore.selectedJobs.includes(project.id)}
                      hasTitle={project.title}
                    />
                    <div className="number-of-item">
                      {Number(jobStore.selectedJobs.includes(project.id))}
                    </div>
                  </div>
                  <div className="label-serial fs-14">
                    <span>PO#</span> {project.po}
                  </div>
                </div>
                <JobItemSchedule rerouteable job={project} index={0} search={() => this.search(this.state.searchParams, true)} />
              </div>
            ))
          }
          <div className="pagination-invoices">
            <PagingComponent
              activePage={this.state.page === 0 ? 1 : this.state.page}
              totalItemsCount={jobStore.projectsLoader.total}
              onChangePage={this.changedPage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default observer(Job);
