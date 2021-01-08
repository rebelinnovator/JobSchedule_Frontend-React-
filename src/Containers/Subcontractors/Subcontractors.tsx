import React from 'react';

import Search from '../../Images/search.png';
import { PagingComponent } from '../Components';
import CEModal from '../Components/Modal/Modal.Component';
import CETSearchInput from '../Components/Controls/SearchInput.Component';
import mainStore from '../../Stores/mainStore';
import { withFormik } from 'formik';
import { WorkerValidation } from '../Workers/WorkerValidation';
import { CreateSubcontractorValidation } from './SubcontractorValidation';
import { subcontractorsAPI, workerAPI } from '../../Services/API';
import { observer } from 'mobx-react';
import { WorkerAsyncSearch } from '../Components/Controls/WorkerAsyncSearch';
import { toast } from 'react-toastify';
import Select from 'react-select';

@observer
export class Subcontractors extends React.Component<any | any> {
  isToggleModal: boolean;
  colSpan = 7;
  details = {} as any;
  searchEnable = false;
  timer = null;
  state = {
    searchParams: {},
    isShowEdit: false,
    dataEdit: null,
    worker: null,
    workers: [],
    workersDefault: [],
    workersList: [],
  };

  showModalEdit = () => {
    this.setState({ isShowEdit: !this.state.isShowEdit });
  };

  showModal() {
    this.isToggleModal = true;
    this.setState({ change: true });
  }

  closeModal() {
    this.isToggleModal = false;
    this.setState({ change: true });
  }

  toggleDetails(name) {
    this.details[name] = !this.details[name];
    this.setState({ change: true });
  }

  renderDetailWorker(workers) {
    if (!workers || workers.length === 0) return '';
    return (
      <div className="row ml-0 mr-0">
        {workers.map((worker, index) => (
          <div key={worker.id} className="view-name-worker">
            <span>{worker.name}</span>
          </div>
        ))}
      </div>
    );
  }

  handleChangeField(name) {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  handleChangeFieldEdit = (name) => {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      const { subcontractor } = this.state.dataEdit;
      if (name === 'companyName') {
        this.setState({
          dataEdit: { ...this.state.dataEdit, companyName: value },
        });
      } else {
        subcontractor[name] = value;
        this.setState({
          dataEdit: { ...this.state.dataEdit, subcontractor },
        });
      }
    };
  };

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.setState(
      (state: any) => ({
        searchParams: { ...state.searchParams, [name]: value },
      }),
      this.loadSubcontractorsWithDelay
    );
  };

  loadSubcontractorsWithDelay = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.loadSubcontractors, 700);
  };

  componentDidMount = async () => {
    this.loadSubcontractors();
    this.loadDataWorkers();
  };

  loadDataWorkers = async () => {
    const response: any = await workerAPI.loadWorkers({
      ...this.props.searchParams,
    });

    if (response.data) {
      const workers = response.data.results.map((worker: any) => ({
        label: worker.name,
        value: worker,
      }));
      this.setState({ workersList: workers });
    }
  };

  loadSubcontractors = (params: any = this.state.searchParams) => {
    mainStore.loadSubcontractors(params);
  };

  onPaginationChange = (page: number) => {
    this.setState(
      (state: any) => ({ searchParams: { ...state.searchParams, page } }),
      this.loadSubcontractorsWithDelay
    );
  };

  handleSubmit = (...props) => {
    this.props.handleSubmit(...props);
    this.closeModal();
  };

  handleEdit = (id, item, companyName, workers, workerIds) => {
    this.setState({
      isShowEdit: true,
      dataEdit: { id, subcontractor: item, companyName, workers, workerIds },
    });
    this.loadDefaultWorkers(workers);
  };

  loadDefaultWorkers = async (workers) => {
    let data = [];
    for (let i = 0; i < this.state.workersList.length; i++) {
      const el = this.state.workersList[i];
      for (let j = 0; j < workers.length; j++) {
        const item = workers[j];
        if (el.value.id === item.id) {
          data.push(this.state.workersList[i]);
        }
      }
    }
    await this.setState({ workersDefault: data });
  };

  onWorkerSelect = (workers) => {
    this.setState({ workers });
  };

  handleUpdateSub = async () => {
    const { dataEdit, workers } = this.state;
    if (workers && dataEdit) {
      const ids = [];
      for (let i = 0; i < workers.length; i++) {
        const el = workers[i];
        ids.push(el.value.id);
      }
      const update = await subcontractorsAPI
        .update(dataEdit.id, {
          ...dataEdit.subcontractor,
          companyName: dataEdit.companyName,
          workerIds: ids,
        })
        .then((res) => {
          toast.success('Subconstructor was updated!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.setState({ isShowEdit: false });
          this.loadSubcontractors();
        })
        .catch((err) => {
          toast.success('Updated subconstructor error!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.setState({ isShowEdit: false });
        });
    }
  };

  render() {
    const thNoBorderLeft = {
      borderLeft: 'none',
    };
    const thNoBorderRight = {
      borderRight: 'none',
    };

    const { errors } = this.props;
    const { dataEdit, workersDefault, workersList } = this.state;

    return (
      <div className="container sub-contractor-page">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">Subcontractors</div>
          <button
            type="button"
            className="btn btn-success btn-add"
            onClick={() => this.showModal()}
          >
            Add New
          </button>
        </div>
        <CEModal
          show={this.isToggleModal}
          onClose={() => this.closeModal()}
          header="Add New Subcontractor"
          size="ce-modal-content"
        >
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="d-block" htmlFor="firstName">
                First Name
              </label>
              <input
                onChange={this.handleChangeField('firstName')}
                className="ce-form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
              />
              <p className="error">{errors.firstName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="lastName">
                Last Name
              </label>
              <input
                onChange={this.handleChangeField('lastName')}
                className="ce-form-control"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
              />
              <p className="error">{errors.lastName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="email">
                Email
              </label>
              <input
                onChange={this.handleChangeField('email')}
                className="ce-form-control"
                id="email"
                name="email"
                placeholder="Enter Email"
              />
              <p className="error">{errors.email}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="companyName">
                Company Name
              </label>
              <input
                onChange={this.handleChangeField('companyName')}
                className="ce-form-control"
                id="companyName"
                name="companyName"
                placeholder="Enter Company Name"
              />
              <p className="error">{errors.companyName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                onChange={this.handleChangeField('phoneNumber')}
                className="ce-form-control"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+X (XXX) XXX XXXX"
              />
              <p className="error">{errors.phoneNumber}</p>
            </div>
            <div className="text-center mt-4 mb-2">
              <button type="submit" className="btn btn-primary btn-add w-100">
                Add
              </button>
            </div>
          </form>
        </CEModal>

        <div className="table-invoices">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th className="th-search">ID</th>
                <th className="th-search">
                  <span>First Name</span>
                  <div className="ce-search-control">
                    <input
                      name={'firstName'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th className="th-search">
                  <span>Last Name</span>
                  <div className="ce-search-control">
                    <input
                      name={'lastName'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th className="th-search">
                  <span>Email</span>
                  <div className="ce-search-control">
                    <input
                      name={'email'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th className="th-search">
                  <span>Phone Number</span>
                  <div className="ce-search-control">
                    <input
                      name={'phoneNumber'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th style={thNoBorderRight} className="th-search">
                  <span>Workers</span>
                  <div className="ce-search-control">
                    <input
                      name={'workers'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
                <th style={thNoBorderRight} className="th-search">
                  <span>
                    Company Name <img className="cursor-pointer" src={Search} />
                  </span>
                  <div className="ce-search-control">
                    <input
                      name={'companyName'}
                      className="ce-search-control-input"
                      onChange={this.handleChangeSearchParams}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            {Array.isArray(mainStore.subcontractors) &&
              mainStore.subcontractors.map(
                ({ id, companyName, subcontractor, workers, workerIds }: any) =>
                  subcontractor && subcontractor.id ? (
                    <tbody key={subcontractor.id}>
                      <tr style={{cursor: 'pointer'}}>
                        <td
                          onClick={() =>
                            this.handleEdit(
                              id,
                              subcontractor,
                              companyName,
                              workers,
                              workerIds
                            )
                          }
                        >
                          {subcontractor.uid}
                        </td>
                        <td
                          onClick={() =>
                            this.handleEdit(
                              id,
                              subcontractor,
                              companyName,
                              workers,
                              workerIds
                            )
                          }
                        >
                          {subcontractor.firstName}
                        </td>
                        <td
                          onClick={() =>
                            this.handleEdit(
                              id,
                              subcontractor,
                              companyName,
                              workers,
                              workerIds
                            )
                          }
                        >
                          {subcontractor.lastName}
                        </td>
                        <td
                          onClick={() =>
                            this.handleEdit(
                              id,
                              subcontractor,
                              companyName,
                              workers,
                              workerIds
                            )
                          }
                        >
                          {subcontractor.email}
                        </td>
                        <td
                          onClick={() =>
                            this.handleEdit(
                              id,
                              subcontractor,
                              companyName,
                              workers,
                              workerIds
                            )
                          }
                        >
                          {' '}
                          {subcontractor.phoneNumber}
                        </td>
                        <td>
                          <span
                            className="cursor-pointer view-details p-2"
                            onClick={() => this.toggleDetails(subcontractor.id)}
                          >
                            {workers.length}
                          </span>
                        </td>
                        <td
                          onClick={() =>
                            this.handleEdit(
                              id,
                              subcontractor,
                              companyName,
                              workers,
                              workerIds
                            )
                          }
                          style={thNoBorderRight}
                        >
                          {companyName}
                        </td>
                      </tr>
                      <tr
                        hidden={
                          !(this.details && this.details[subcontractor.id])
                        }
                        className="sub-details"
                      >
                        <td colSpan={this.colSpan}>
                          {this.renderDetailWorker(workers || [])}
                        </td>
                      </tr>
                    </tbody>
                  ) : null
              )}
          </table>
        </div>
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={mainStore.subcontractorsLoader.total}
            onChangePage={this.onPaginationChange}
          />
        </div>

        <CEModal
          show={this.state.isShowEdit}
          onClose={() => this.showModalEdit()}
          header="Edit Subcontractor"
          size="ce-modal-content"
        >
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="d-block" htmlFor="firstName">
                First Name
              </label>
              <input
                onChange={this.handleChangeFieldEdit('firstName')}
                className="ce-form-control"
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                value={
                  (dataEdit &&
                    dataEdit.subcontractor &&
                    dataEdit.subcontractor.firstName) ||
                  ''
                }
              />
              <p className="error">{errors.firstName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="lastName">
                Last Name
              </label>
              <input
                onChange={this.handleChangeFieldEdit('lastName')}
                className="ce-form-control"
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                value={
                  (dataEdit &&
                    dataEdit.subcontractor &&
                    dataEdit.subcontractor.lastName) ||
                  ''
                }
              />
              <p className="error">{errors.lastName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="email">
                Email
              </label>
              <input
                onChange={this.handleChangeFieldEdit('email')}
                className="ce-form-control"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={
                  (dataEdit &&
                    dataEdit.subcontractor &&
                    dataEdit.subcontractor.email) ||
                  ''
                }
              />
              <p className="error">{errors.email}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="companyName">
                Company Name
              </label>
              <input
                onChange={this.handleChangeFieldEdit('companyName')}
                className="ce-form-control"
                name="companyName"
                placeholder="Enter Company Name"
                value={(dataEdit && dataEdit.companyName) || ''}
              />
              <p className="error">{errors.companyName}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                onChange={this.handleChangeFieldEdit('phoneNumber')}
                className="ce-form-control"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+X (XXX) XXX XXXX"
                value={
                  (dataEdit &&
                    dataEdit.subcontractor &&
                    dataEdit.subcontractor.phoneNumber) ||
                  ''
                }
              />
              <p className="error">{errors.phoneNumber}</p>
            </div>
            <div className="form-group">
              <label className="d-block" htmlFor="phoneNumber">
                Workers
              </label>

              <Select
                defaultValue={this.state.workersDefault}
                isMulti
                name="colors"
                options={this.state.workersList}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(item) => this.onWorkerSelect(item)}
              />
              {/* <WorkerAsyncSearch
                defaultValue={
                  dataEdit && dataEdit.workers
                }
                // defaultInputValue={
                //   dataEdit &&
                //   dataEdit.workers
                // }
                isMulti={true}
                onSelect={(item) => this.onWorkerSelect(item)}
              /> */}
            </div>
            <div className="text-center mt-4 mb-2">
              <button
                type="button"
                className="btn btn-primary btn-add w-100"
                onClick={this.handleUpdateSub}
              >
                Save
              </button>
            </div>
          </form>
        </CEModal>
      </div>
    );
  }
}

export default withFormik({
  mapPropsToValues: () => ({
    name: '',
    email: '',
    phoneNumber: '',
    subcontractor: '',
    avatar: '',
    firstName: '',
    lastName: '',
  }),
  validationSchema: CreateSubcontractorValidation,
  handleSubmit: (values, { props }) => {
    subcontractorsAPI.create(values).then((res) => {
      if (res.status < 300) {
        mainStore.loadSubcontractors();
      }
    });
  },
})(Subcontractors);
