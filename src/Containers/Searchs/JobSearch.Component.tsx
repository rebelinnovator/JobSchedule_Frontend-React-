import * as React from 'react';
import search from '../../Images/search.png';
import * as CeIcon from '../../Utils/Icon';
import './searchstyle.scss';

interface Props {
  onChange: (name: string, value: string) => void;
}

export class JobSearchComponent extends React.Component<Props | any> {

  handleChangeInput = (event) => {
    const { currentTarget: { value, name } } = event;
    this.props.onChange(name, value);
  }

  public render() {
    return (
      <div className="left-item">
        <div className="left-item-body d-flex">
          <div className="form-control-search mr-2 w-100" >
            <img src={search} />
            <input className="ce-form-control "
              placeholder="Search" name="keyword"
              onChange={this.handleChangeInput} />
          </div>

          <div className="btn-group">
            <button
              onClick={() => { }}
              className={'btn border d-flex align-items-center '}
              type="button"
            >
              {
                true  ? <CeIcon.FilterIcon /> : <CeIcon.FilterWhiteIcon />
              }
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default JobSearchComponent;
