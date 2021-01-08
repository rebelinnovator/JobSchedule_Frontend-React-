import React from 'react';
import CommentSolid from '../../Images/comment-solid.png';
import CloseIcon from '../../Images/close-regular.png';
import { PagingComponent } from '../Components';
import mainStore from '../../Stores/mainStore';
import * as CEIcon from '../../Utils/Icon';
import { observer } from 'mobx-react';
import { userService } from '../../Services';
import Select from '../Components/Select/Select';
import { createBrowserHistory } from 'history';
import { workerAPI } from '../../Services/API';
import authStore from '../../Stores/authStore';
import CEModal from '../Components/Modal/Modal.Component';
import './Workers.scss';
import { FadeLoader } from 'react-spinners';
import { css } from '@emotion/core';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { JobType } from '../../Constants/job';
import ReactSelect from 'react-select';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

interface Props {}

export const WORKER_TYPE = [
  {
    label: 'Parking',
    value: JobType.Parking,
  },
  {
    label: 'Flagging',
    value: JobType.Flagging,
  },
  {
    label: 'Signage',
    value: JobType.Signage,
  },
];

const workerOptions = ['Active', 'Inactive', 'OnHold'];

@observer
export class Workers extends React.Component<Props> {
  details = {} as any;
  comment: string = '';
  timer = null;
  state = {
    searchParams: {},
    showWorkerModal: false,
    workerId: null,
    workerName: null,
    status: null,
    isImport: false,
  };
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.comment = '';
    this.sendComment = this.sendComment.bind(this);
    this.toggleDetails = this.toggleDetails.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.state = {
      searchParams: {},
      showWorkerModal: false,
      workerId: null,
      workerName: null,
      status: null,
      isImport: false,
    };
    this.inputRef = React.createRef();
  }
  isToggleFilter: boolean;

  toggleFilter() {
    this.isToggleFilter = !this.isToggleFilter;
    this.setState({ change: true });
  }

  toggleDetails(name) {
    this.details[name] = !this.details[name];
    this.setState({ change: true });
  }

  sendComment(value: any) {
    this.comment = value.target.value;
    value.target.value = '';
    this.setState({ change: true });
  }

  handleInputChange(event) {
    if (event.keyCode === 13) {
      return;
    }
    // this.comment = event.target.value;
    // this.setState({ change: true });
  }

  keyPress(e) {
    if (e.keyCode === 13) {
      // this.sendComment(e.target.value)
    }
  }

  goDetail(workerId) {
    createBrowserHistory({ forceRefresh: true }).push(`/workers/${workerId}`);
  }

  renderComment() {
    if (this.comment) {
      return (
        <div>
          <span>{this.comment}</span>
        </div>
      );
    }
    return (
      <div className="position-relative">
        <input
          className="ce-form-control"
          placeholder="Your Comment..."
          onKeyDown={this.keyPress}
          onChange={this.handleInputChange}
        ></input>
        <CEIcon.SendButtonIcon
          className="send-button cursor-pointer"
          onClick={this.sendComment}
        ></CEIcon.SendButtonIcon>
      </div>
    );
  }

  componentDidMount() {
    this.loadWorkers();
  }

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.setState(
      (state: any) => ({
        searchParams: { ...state.searchParams, [name]: value },
      }),
      this.loadWorkersWithDelay
    );
  };

  loadWorkersWithDelay = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(this.loadWorkers, 700);
  };

  loadWorkers = (params: any = this.state.searchParams) => {
    mainStore.loadWorkers(params);
  };

  onPaginationChange = (page: number) => {
    this.setState(
      (state: any) => ({ searchParams: { ...state.searchParams, page } }),
      this.loadWorkersWithDelay
    );
  };

  onStatusChange = async (id, name, status) => {
    this.setState({
      showWorkerModal: true,
      workerId: id,
      workerName: name,
      status: status,
    });
  };

  changeStatus = async (id, status) => {
    await workerAPI.update(id, { status: status.toLowerCase() });
    this.showModal(false);
    this.loadWorkers();
  };

  showModal(show) {
    this.setState({
      showWorkerModal: show,
      workerId: null,
      workerName: null,
      status: null,
    });
  }

  handleChangeFileExcel = async (e: any) => {
    this.setState({ isImport: true });
    let file = e.target.files[0];
    let fd = new FormData();
    fd.append('excel', file);
    await workerAPI.importExcel(fd).then((res) => {
      this.setState({ isImport: false });
      if (res.status === 200) {
        toast.success('Workers import successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };

  triggerInputFile = () => {
    this.inputRef.current.click();
  };

  onTypeSelect = (items) => {
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          workerTypes: items ? items.map((item) => item.value) : [],
        },
      }),
      this.loadWorkersWithDelay
    );
  };

  public render() {
    const { isImport } = this.state;
    return (
      <div className="container workers-list-page">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div className="page-title">Workers</div>
          <div className="user-role-action">
            <Link className="goto-create-role mr-3" to={`/workers/create`}>
              <button className="btn-new btn btn-success btn-add">
                Add New
              </button>
            </Link>
            <input
              className="input-excel"
              accept=".xls,.xlsx"
              ref={this.inputRef}
              type="file"
              onChange={this.handleChangeFileExcel}
            />
            <button
              className="btn-import btn btn-success btn-add bg-color-primary"
              onClick={this.triggerInputFile}
            >
              Import from Excel
            </button>
          </div>
        </div>
        <FadeLoader css={override} color={'#36d7b7'} loading={isImport} />
        <div className="scroll-mobile">
          <div className="div-table table-responsive">
            <div className="div-header align-items-stretch">
              <div className="div-col flex-column align-items-start">
                <div>Employee #</div>
                {/* <CETSearchInput /> */}
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Name</div>
                <div className="ce-search-control">
                  <input
                    name={'firstName'}
                    className="ce-search-control-input"
                    onChange={this.handleChangeSearchParams}
                  ></input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Status</div>
                <div className="ce-search-control">
                  <input
                    className="ce-search-control-input"
                    name={'status'}
                    onChange={this.handleChangeSearchParams}
                  ></input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Email</div>
                <div className="ce-search-control">
                  <input
                    className="ce-search-control-input"
                    name={'email'}
                    onChange={this.handleChangeSearchParams}
                  ></input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Phone Number</div>
                <div className="ce-search-control">
                  <input
                    className="ce-search-control-input"
                    name={'phoneNumber'}
                    onChange={this.handleChangeSearchParams}
                  ></input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Worker Types</div>
                <div className="ce-search-control w-100">
                  <ReactSelect
                    onChange={this.onTypeSelect}
                    placeholder="All Type"
                    options={WORKER_TYPE}
                    isMulti
                  />
                </div>
              </div>
              <div
                className="div-col d-flex"
                style={{ alignItems: 'self-end' }}
              >
                <div
                  className="d-flex flex-column justify-content-between"
                  style={{ flex: 'auto' }}
                >
                  <span className="pr-1">Subcontractor</span>
                  <div className="ce-search-control">
                    <input
                      className="ce-search-control-input"
                      name="subcontractorName"
                      onChange={this.handleChangeSearchParams}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div className="div-body">
              {mainStore.workers &&
                mainStore.workers.map((item, index) => {
                  const user = userService.serialize(item);
                  return (
                    <this.Item
                      {...{
                        user,
                        index,
                        key: user.id,
                        renderComment: this.renderComment,
                        details: this.details,
                        toggleDetails: this.toggleDetails,
                        goDetail: this.goDetail,
                        onStatusChange: this.onStatusChange,
                      }}
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <div className="pagination-invoices">
          <PagingComponent
            totalItemsCount={mainStore.workersLoader.total}
            onChangePage={this.onPaginationChange}
          />
        </div>
        <CEModal
          show={this.state.showWorkerModal}
          onClose={() => this.showModal(false)}
          size="ce-modal-content"
        >
          <div>
            <div className="ce-flex-right">
              <a
                className="pull-right"
                onClick={() => {
                  this.showModal(false);
                }}
              >
                <img src={CloseIcon} />
              </a>
            </div>
            <div className="text-center">
              <div className="m-3">
                <span>
                  {`Are you sure to change `}
                  <b>{this.state.workerName}</b>
                  {` to `} <b>{this.state.status}</b> ?
                </span>
              </div>
              <div className="d-flex justify-content-between mx-2 mt-40 mb-25">
                <a
                  className="btn ce-btn-modal-save mr-5"
                  onClick={() =>
                    this.changeStatus(this.state.workerId, this.state.status)
                  }
                >
                  <span>Yes</span>
                </a>
                <a
                  className="btn ce-btn-modal-cancel"
                  onClick={() => {
                    this.showModal(false);
                  }}
                >
                  <span>No</span>
                </a>
              </div>
            </div>
          </div>
        </CEModal>
      </div>
    );
  }

  renderType = (workerType: number) => {
    const type = WORKER_TYPE.find((type) => type.value === workerType);
    return type ? (
      <span className="badge badge-secondary p-2 mr-2">{type.label}</span>
    ) : null;
  };

  Item = ({
    user,
    index,
    renderComment,
    details,
    toggleDetails,
    goDetail,
    onStatusChange,
  }) => (
    <div key={user.email} className="div-temp">
      <div className="div-item">
        <div
          className="div-col cursor-pointer overflow-hidden"
          onClick={() => goDetail(user.id)}
        >
          <a className="" href={`/workers/${user.id}`}>
            {user.uid}
          </a>
        </div>
        <div
          className="div-col d-flex align-items-center cursor-pointer"
          onClick={() => goDetail(user.id)}
        >
          <img
            alt="avatar"
            className="avatar mr-3"
            style={{ objectFit: 'cover' }}
            src={`${process.env.REACT_APP_API_ENDPOINT}${user.avatar}`}
          />
          <span className="name-workers overflow-auto">{user.name}</span>
        </div>
        <div className="div-col d-flex align-items-center">
          {authStore.canDoWorkerAction() ? (
            <Select
              status={user.status}
              options={workerOptions}
              isWorkerStatus={true}
              onSelect={(status) => onStatusChange(user.id, user.name, status)}
            />
          ) : (
            <div className="d-flex align-items-center mr-3">
              <div className={`mr-2 circle-${user.status.toLowerCase()}`}></div>
              <div className="status-select">
                <div className="status-select__title d-flex align-items-center">
                  <div className="name mr-2 cursor-pointer">{user.status}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="div-col overflow-auto ">{user.email}</div>
        <div className="div-col overflow-auto ">{user.phoneNumber}</div>
        <div className="div-col overflow-auto ">
          {Array.isArray(user.workerTypes)
            ? user.workerTypes.map(this.renderType)
            : null}
        </div>
        <div className="div-col d-flex justify-content-between">
          <span>{user.subcontractorName}</span>
          <span>
            {user.hasmessage && (
              <img
                className="cursor-pointer"
                src={CommentSolid}
                onClick={() => toggleDetails(index)}
              />
            )}
          </span>
        </div>
      </div>
      {details && details[index] && (
        <div className="div-item-expand">{renderComment()}</div>
      )}
    </div>
  );
}

export default Workers;
