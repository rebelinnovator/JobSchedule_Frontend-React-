import React, { RefObject } from 'react';
import DropdownComponent from '../Components/Dropdownlist/Dropdown.Component';
import CEModal from '../Components/Modal/Modal.Component';
import * as CeIcon from '../../Utils/Icon';
import RolesAsyncSearch from '../Components/Controls/RolesAsyncSearch';
import SubcontractorAsyncSearch from '../Components/Controls/SubcontractorAsyncSearch';
import { createBrowserHistory } from 'history';
import { withFormik } from 'formik';
import { CreateUserValidation } from './CreateUserValidation';
import { userAPI } from '../../Services/API';
import authStore from '../../Stores/authStore';
export class CreateUser extends React.Component<any> {
  isToggleModal: boolean;
  showImage = false;
  file: any;
  private readonly inputOpenFileRef: RefObject<HTMLInputElement> = React.createRef();

  removeImage() {
    this.showImage = false;
    this.file = undefined;
    this.setState({ change: true });
  }
  closeModal = () => {
    this.isToggleModal = false;
    this.setState({ change: true });
  }
  showModal() {
    this.isToggleModal = true;
    this.setState({ change: true });
  }
  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  }

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    this.file = event.target.files[0]; // URL.createObjectURL(event.target.files[0]);
    this.handleValueChange('avatar', this.file)
    this.showImage = true;
    this.inputOpenFileRef.current.value = '';
    this.setState({ change: true });
  }

  handleValueChange = (name, value) => {
    return this.props.setFieldValue(name, value);
  }

  handleInputChange = (event) => {
    const { name, value, type } = event.currentTarget;
    if (type === 'number') {
      return this.handleValueChange(name, Number(value));
    }
    return this.handleValueChange(name, value);
  }

  public render() {
    const { errors, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div className="container user-create-page">
          <div className="page-header">
            <div className="page-title">Add New User</div>
          </div>
          <div className="box-item-body">
            <div className="row role-group">
              <div className="form-group col-sm-4">
                <label className="d-block">Roles</label>
                <RolesAsyncSearch
                  onSelect={(item: any) =>
                    this.handleValueChange('roles', item ? item.map(role => role.value.id) : [])}
                  isMulti
                  onlyDispatcher={!authStore.isSuperAdmin()} />
                <p className="error">{errors.roles}</p>
              </div>
            </div>
            <div className="row role-info">
              <div className="form-group col-sm-4">
                <label className="d-block">Name</label>
                <input
                  className="ce-form-control"
                  name="name"
                  onChange={this.handleInputChange}
                  placeholder="Name" />
                <p className="error">{errors.name}</p>
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Email</label>
                <input
                  className="ce-form-control"
                  name="email"
                  onChange={this.handleInputChange}
                  placeholder="Email" />
                <p className="error">{errors.email}</p>
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Phone Number</label>
                <input
                  className="ce-form-control"
                  name={'phoneNumber'}
                  onChange={this.handleInputChange}
                  placeholder="+X (XXX) XXX XXXX" />
                <p className="error">{errors.phoneNumber}</p>
              </div>
            </div>
            <div className="row role-contract">
              <div className="form-group col-sm-4">
                <label className="d-block">Subcontractor</label>
                <SubcontractorAsyncSearch
                  isClearable={false}
                  onSelect={item => this.handleValueChange('subcontractorId', item.value.id)} />
                <p className="error">{errors.subcontractorId}</p>
              </div>
            </div>

            <div className="row role-upload">
              <input type="file" id="file" ref={this.inputOpenFileRef} style={{ display: 'none' }} onChange={this.onChangeFile.bind(this)} />
              <div className="form-group ml-3  upload-control">
                <div className="btn ce-btn-confirm cursor-pointer ce-mr-10" onClick={() => this.showOpenFileDlg()}>
                  <span>Upload Photo</span>
                </div>
                {
                  this.showImage
                  &&
                  <div className="photo-detail">
                    <div className="user-photo-preview ce-mr-10" style={{ backgroundImage: `url(${URL.createObjectURL(this.file)})` }}>

                    </div>
                    <div >
                      <div>
                        <span className="photo-name">
                          {
                            this.file.name
                          }
                        </span>
                      </div>
                      <div className="photo-size">
                        <span className="ce-mr-10" >
                          {
                            (this.file.size / 1000) + 'KB'
                          }
                        </span>
                        <span className="delete-action" onClick={() => {
                          this.file = null;
                          this.showImage = false;
                        }}>Delete</span>
                      </div>
                    </div>
                  </div>

                }
              </div>
              <div className="form-group col-sm-4">

              </div>
            </div>

            <CEModal show={this.isToggleModal} onClose={() => this.closeModal()} size="ce-modal-content" >
              <div >
                <div className="modal-header">
                  <span>Reject Registration</span>
                  <div className="ce-flex-right" >

                    <a className="pull-right" onClick={() => {
                      this.closeModal();
                    }}>
                      <CeIcon.Close />
                    </a>
                  </div>
                </div>
                <div className="modal-page-content">

                  <div className="mx-2">
                    <span>
                      Are you sure you want to reject the registration?
                            </span>
                  </div>
                  <div className="modal-comment mx-2">
                    <label>Comment</label>
                    <textarea rows={4} />
                  </div>
                  <div className="d-flex justify-content-between mx-2 mt-40 mb-25">
                    <a className="btn ce-btn-modal-cancel" onClick={() => {
                      this.closeModal();
                    }}><span>Cancel</span></a>
                    <a className="btn ce-btn-modal-save" onClick={() => {
                      this.props.history.push('/roles');
                    }}><span>Reject</span></a>
                  </div>
                </div>
              </div>
            </CEModal>

          </div>
          <div className="mt-4 d-flex justify-content-end page-action-bottom">
            <button type="button" className="btn btn-outline-secondary mr-2" onClick={() => {
              this.showModal();
            }}>Reject</button>
            <button type="submit" className="btn btn-success btn-add">Add User</button>
          </div>
        </div>
      </form>
    );
  }
}


export default withFormik({
  mapPropsToValues: () => ({
    name: '',
    email: '',
    phoneNumber: '',
    subcontractorId: '',
    avatar: '',
    firstName: '',
    lastName: '',
  }),
  validationSchema: CreateUserValidation,
  handleSubmit: async (values, { props }) => {

    const name = values.name.split(' ');
    values.firstName = name[0];
    values.lastName = name[1];
    const response = await userAPI.create(values);
    if (response.status < 300) {
      createBrowserHistory({ forceRefresh: true }).push('/roles');
    }
  },
})(CreateUser);

