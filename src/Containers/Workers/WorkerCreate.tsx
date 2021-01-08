import { withFormik } from 'formik';
import { createBrowserHistory } from 'history';
import React, { RefObject } from 'react';
import { User } from '../../Models/APITypes';
import { workerAPI } from '../../Services/API';
import { WorkerValidation } from './WorkerValidation';
import SubcontractorAsyncSearch from '../Components/Controls/SubcontractorAsyncSearch';
import { ISelectItem } from '../Components/Controls/AsyncSelect';
import { WORKER_TYPE } from './Workers';
import ReactSelect from 'react-select';

class WorkerCreateComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  showImage = false;
  file: any;
  private readonly inputOpenFileRef: RefObject<HTMLInputElement> = React.createRef();

  handleChangeField(name) {
    return (event) => {
      const {
        currentTarget: { value },
      } = event;
      return this.props.setFieldValue(name, value);
    };
  }

  removeImage() {
    this.showImage = false;
    this.file = undefined;
    this.setState({ change: true });
    this.props.setFieldValue('avatar', undefined);
  }

  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click();
  };

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const blob = event.target.files[0];
    this.file = URL.createObjectURL(blob);
    this.showImage = true;
    this.inputOpenFileRef.current.value = '';
    this.setState({ change: true });
    this.props.setFieldValue('avatar', blob);
  }

  onSubcontractorSelected = (subcontractor: ISelectItem) => {
    if (!subcontractor) {
      this.props.setFieldValue('subcontractorId', '');
      this.props.setFieldValue('subcontractor', null);
      return;
    }

    this.props.setFieldValue('subcontractorId', subcontractor.value.id);
    this.props.setFieldValue('subcontractor', subcontractor.value);
  };

  onTypeSelect = (items) => {
    if (items && items.length > 0) {
      this.props.setFieldValue(
        'workerTypes',
        items.map((item) => Number(item.value))
      );
    } else {
      this.props.setFieldValue('workerTypes', []);
    }
  };

  public render() {
    const { errors, handleSubmit } = this.props;

    return (
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="container worker-create-page">
          <div className="page-header">
            <div className="page-title">Add New Worker</div>
          </div>
          <div className="box-item-body">
            <input
              type="file"
              id="file"
              ref={this.inputOpenFileRef}
              style={{ display: 'none' }}
              onChange={this.onChangeFile.bind(this)}
            />
            {this.showImage ? (
              <div
                className="view-feature-image"
                style={{ backgroundImage: `url(${this.file})` }}
                onClick={() => this.showOpenFileDlg()}
              >
                <div
                  className="remove-feature-image d-flex"
                  onClick={() => this.removeImage()}
                >
                  <i className="fa fa-times m-auto"></i>
                </div>
              </div>
            ) : (
              <div
                className="feature-image d-flex"
                onClick={() => this.showOpenFileDlg()}
              >
                {/* <i className="fa fa-camera m-auto"></i> */}
              </div>
            )}
            <p className="error">{errors.avatar}</p>
            <div className="row mt-3">
              <div className="form-group col-sm-4">
                <label className="d-block">Name</label>
                <input
                  className="ce-form-control"
                  placeholder="First name Last Name"
                  onChange={this.handleChangeField('name')}
                />
                <p className="error">{errors.name}</p>
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Email</label>
                <input
                  className="ce-form-control"
                  placeholder="Email"
                  onChange={this.handleChangeField('email')}
                />
                <p className="error">{errors.email}</p>
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Phone Number</label>
                <input
                  className="ce-form-control"
                  placeholder="+X (XXX) XXX XXXX"
                  onChange={this.handleChangeField('phoneNumber')}
                />
                <p className="error">{errors.phoneNumber}</p>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-sm-4">
                <label className="d-block">Worker Types</label>
                <ReactSelect
                  onChange={this.onTypeSelect}
                  placeholder="All Type"
                  options={WORKER_TYPE}
                  isMulti
                />
              </div>
              <div className="form-group col-sm-4">
                <label className="d-block">Subcontractor</label>
                <SubcontractorAsyncSearch
                  isClearable
                  onSelect={(subcontractor: ISelectItem) =>
                    this.onSubcontractorSelected(subcontractor)
                  }
                />
                <p className="error">{errors.subcontractor}</p>
                <p className="error">{errors.subcontractorId}</p>
              </div>

              <div className="form-group col-sm-4">
                <label className="d-block">Password</label>
                <input
                  autoComplete="off"
                  type="password"
                  className="ce-form-control"
                  onChange={this.handleChangeField('password')}
                />
                <p className="error">{errors.password}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 d-flex justify-content-end page-action-bottom">
            <button type="submit" className="btn btn-success btn-add">
              Add Worker
            </button>
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
    workerTypes: [],
  }),
  validationSchema: WorkerValidation,
  handleSubmit: (values, { props }) => {
    const name = values.name.split(' ');
    values.firstName = name[0];
    values.lastName = name[1];
    workerAPI.create(values as User).then((res) => {
      if (res.status === 201) {
        console.log('1111: ', res.data);
        // createBrowserHistory({ forceRefresh: true }).push('/workers');
      }
    });
  },
})(WorkerCreateComponent);
