import React from 'react';
import Right from '../../Images/chevron-right-12.png';
import Search from '../../Images/search.png';
import Select from 'react-select';
import { PagingComponent } from '../Components';
import workerImage from '../../Images/worker.png';
import actionRight from '../../Images/action-right.png';
import * as CEIcon from '../../Utils/Icon';
import CheckboxComponent from '../Components/Controls/Checkbox.Component';
import DropdownComponent from '../Components/Dropdownlist/Dropdown.Component';
import userStore from '../../Stores/userStore';
import { EROLES, APPROVE, ROLES } from '../../Constants/user';
import { observer } from 'mobx-react';
import { User } from '../../Models';
import { userAPI } from '../../Services/API';
import RolesAsyncSearch from '../Components/Controls/RolesAsyncSearch';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { toast } from 'react-toastify';
import { css } from '@emotion/core';
import FadeLoader from 'react-spinners/FadeLoader';
import authStore from '../../Stores/authStore';
import './Roles.scss';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

interface Props {
  history: any;
}

const actions = [
  {
    id: 'approval',
    label: 'Approval',
  },
  {
    id: 'reject',
    label: 'Reject',
  },
  {
    id: 'edit',
    label: 'Edit',
  },
  {
    id: 'delete',
    label: 'Delete',
  },
];

const status = [
  {
    label: 'Approved',
    value: APPROVE.approved,
  },
  {
    label: 'Rejected',
    value: APPROVE.rejected,
  },
  {
    label: 'Waiting Approval',
    value: APPROVE.waiting,
  }
]

const noBorder = {
  border: '1px solid #dbdede',
  borderLeft: 'none',
};

@observer
export class RolesComponent extends React.Component<Props> {
  state: any;
  refInput: any;
  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.state = props.location.state ? props.location.state : {
      searchParams: {
        status: '1',
      },
      isImport: false,
    };
    this.inputRef = React.createRef();
  }

  toggleInactive = (active) => {
    if (active) {
      this.setState(
        (state: any) => ({
          searchParams: {
            ...state.searchParams,
            status: '0',
            page: 1,
          },
        }),
        this.fetchUsers
      );
    } else {
      this.setState(
        (state: any) => ({
          searchParams: {
            ...state.searchParams,
            status: '1',
            page: 1,
          },
        }),
        this.fetchUsers
      );
    }
  };

  onRoleSelect = (items) => {
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          page: 1,
          roles: items ? items.map((role) => role.value.id) : [],
        },
      }),
      this.fetchUsers
    );
  };

  onStatusSelect = (items) => {
    this.setState(
      (state: any) => ({
        searchParams: {
          ...state.searchParams,
          page: 1,
          statuses: items ? items.map((status) => status.value) : [],
        },
      }),
      this.fetchUsers
    );
  };

  fetchUsers = () => {
    if (!authStore.isSuperAdmin()) {
      if (this.state.searchParams.roles) {
        this.state.searchParams.roles.filter((item) => item === EROLES.dispatcher || item === EROLES.dispatcher_supervisor);
      } else {
        this.state.searchParams.roles = [EROLES.dispatcher_supervisor, EROLES.dispatcher];
      }
    }
    userStore.loadUsers(this.state.searchParams);
  };

  onPaginationChange = (page: number) => {
    this.setState(
      (state: any) => ({ searchParams: { ...state.searchParams, page } }),
      this.fetchUsers
    );
  };

  componentDidMount() {
    this.fetchUsers();
  }

  onEdit = (id: string) => {
    this.props.history.push({
      pathname: `/profile/${id}`,
      state: this.state
    });
  };

  handleChangeFileExcel = async (e: any) => {
    this.setState({ isImport: true });
    let file = e.target.files[0];
    let fd = new FormData();
    fd.append('excel', file);
    await userAPI.importExcel(fd).then((res) => {
      this.setState({ isImport: false });
      if (res.status === 200) {
        toast.success('Users import successfully!', {
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

  handleChangeSearchParams = (event) => {
    const { name, value } = event.target;
    this.setState(
      (state: any) => ({ searchParams: { ...state.searchParams, [name]: value } }),
      this.fetchUsers);
  };


  render() {
    const { isImport } = this.state;
    return (
      <div className="container roles-list-page">
        <div className="page-header d-flex flex-wrap justify-content-between align-items-center">
          <div className="page-title">Manage User Roles</div>
          <div className="action-new">
            <div className="d-flex roles-group align-items-center">
              <div className="roles-group__checkbox">
                <CheckboxComponent
                  id="zxcxz"
                  onChange={this.toggleInactive}
                  hasTitle="Show Inactive Users"
                  className="mr-3 d-flex justify-content-end"
                  skipReceiveProps={true}
                  checked={this.state.searchParams && this.state.searchParams.status && this.state.searchParams.status === '0'}
                />
              </div>
              {/* <div className="roles-group__dropdown">
                <div className="d-block " style={{ width: 185 }}>
                  <RolesAsyncSearch
                    isMulti
                    onSelect={this.onRoleSelect}
                    placeholder={'All Roles'}
                    onlyDispatcher={!authStore.isSuperAdmin()}
                  />
                </div>
                <img className="d-inline d-md-none" src={Search} />
              </div> */}
            </div>
            <div className="user-role-action">
              <Link className="goto-create-role" to={`/roles/create`}>
                <button className="btn-new btn btn-success btn-add">
                  Create new
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
        </div>
        <FadeLoader css={override} color={'#36d7b7'} loading={isImport} />

        <div className="scroll-mobile">
          <div className="div-table div-role-table table-responsive">
            <div className="div-header align-items-stretch">
              <div className="div-col flex-column align-items-start">
                <div>Name</div>
                <div className="ce-search-control">
                  <input
                    name={'firstName'}
                    className="ce-search-control-input"
                    onChange={this.handleChangeSearchParams}>
                  </input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Email</div>
                <div className="ce-search-control">
                  <input
                    className="ce-search-control-input"
                    name={'email'}
                    onChange={this.handleChangeSearchParams}>
                  </input>
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Roles</div>
                <div className="ce-search-control">
                  <RolesAsyncSearch
                    isMulti
                    onSelect={this.onRoleSelect}
                    placeholder={'All Roles'}
                    onlyDispatcher={!authStore.isSuperAdmin()}
                  />
                </div>
              </div>
              <div className="div-col flex-column align-items-start">
                <div>Status</div>
                <div className="ce-search-control">
                  <Select
                    onChange={this.onStatusSelect}
                    placeholder="All Status"
                    options={status}
                    isMulti
                  />
                </div>
              </div>
            </div>
            <div className="div-body">
              {userStore.users.map((user) => (
                <Role onEdit={this.onEdit} user={user} key={user._id} />
              ))}
            </div>
          </div>
        </div>

        <div className="pagination-invoices">
          <PagingComponent
            activePage={this.state.searchParams.page}
            totalItemsCount={userStore.userLoader.total}
            onChangePage={this.onPaginationChange}
          />
        </div>
      </div>
    );
  }
}

export default RolesComponent;

interface IRole {
  user: User;
  onEdit: (id: string) => void;
}

class Role extends React.Component<IRole> {
  listener = null;
  state = {
    menu: false,
  };

  onAction = async (action) => {
    switch (action) {
      case 'approval':
        userStore.updateUserApprove(this.props.user.id, APPROVE.approved);
        break;
      case 'reject':
        userStore.updateUserApprove(this.props.user.id, APPROVE.rejected);
        break;
      case 'edit':
        this.props.onEdit(this.props.user.id);
        break;
      case 'delete':
        userStore.deleteUser(this.props.user.id);
        break;
      default:
        break;
    }
  };

  openMenu = () => {
    this.setState({ menu: true });
    this.listener = true;
    document.addEventListener('click', this.onDocumentClick);
  };

  componentWillUnmount = () => {
    if (this.listener) {
      this.listener = false;
      document.removeEventListener('click', this.onDocumentClick);
    }
  };

  onDocumentClick = (event) => {
    this.setState({ menu: false });
    this.listener = false;
    document.removeEventListener('click', this.onDocumentClick);
  };

  renderRole = (roleId: number) => {
    const role = ROLES.find((role) => role.id === roleId);
    return role ? (
      <span className="badge badge-secondary p-2 mr-2">{role.name}</span>
    ) : null;
  };

  render() {
    const { user } = this.props;
    return (
      <div key={user.email} className="div-temp">
        <div className="div-item">
          <div
            className="div-col d-flex align-items-center"
          >
            <img alt="avatar" className="avatar mr-3" style={{ objectFit: 'cover' }} src={`${process.env.REACT_APP_API_ENDPOINT}${user.avatar}`} />
            <span className="name-workers overflow-auto">
              {user.name}
            </span>
          </div>
          <div className="div-col overflow-auto ">{user.email}</div>
          <div className="div-col overflow-auto ">{Array.isArray(user.roles) ? user.roles.map(this.renderRole) : null}</div>
          <div className="div-col d-flex justify-content-between">
            <div
              id="contextMore"
              className="d-flex align-items-center justify-content-end cursor-pointer"
            >
              <span className="badge badge-pill badge-primary bg-color-primary py-2 px-3">
                {user.isApproved === APPROVE.waiting
                  ? 'Waiting Approval'
                  : user.isApproved === APPROVE.approved
                    ? 'Approved'
                    : 'Rejected'}
              </span>
              <div style={{ position: 'relative' }}>
                <CEIcon.MoreIcon
                  onClick={this.openMenu}
                  style={{ width: '10px' }}
                  className="ml-3 contextMore"
                  width={5}
                  height={23}
                />
                {this.state.menu ? (
                  <div
                    className="custom-context"
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      zIndex: 1000,
                    }}
                  >
                    {actions.map((action, index) => (
                      <div
                        key={index}
                        onClick={() => this.onAction(action.id)}
                        className="custom-context-item-role-last"
                      >
                        {action.label}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}
