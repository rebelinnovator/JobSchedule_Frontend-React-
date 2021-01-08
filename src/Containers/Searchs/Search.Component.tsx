import * as React from 'react';
import search from '../../Images/search.png';
import './searchstyle.scss';
import AlignCenter1 from '../../Images/align-center-1.png';
import FilterIcon from '../../Images/filter.png';
import * as CeIcon from '../../Utils/Icon';
interface Props {
  hasFilter?: boolean;
  hasSort?: boolean;
  onFilterRaised?: Function;
  onSortRaised?: Function;
}
export class SearchComponent extends React.Component<Props> {
  pX: number;
  pY: number;
  visible: boolean = false;
  contextRef: any;
  items: Array<any>;
  sortactive: string = '';
  filteractive: string = '';
  constructor(props) {
    super(props);
    this.visible = false;
    this.items = new Array<any>();
    this.items.push({
      id: 'Date',
      label: 'Date of Service',
      state: 1,
    });
    this.items.push({
      id: 'Time',
      label: 'Time Request',
      state: 1,
    });
    this.handleSort = this.handleSort.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }
  componentDidMount() {
    // document.addEventListener('click', this.handleOutsideClick);
    // const self = this;

    // document.addEventListener('click', function (event) {

    //   if ((event.toElement && event.toElement.hasAttribute('id') && event.toElement.getAttribute('id') == 'contextMenu')
    //             || (event.toElement.parentElement && event.toElement.parentElement.hasAttribute('id') && event.toElement.parentElement.getAttribute('id') == 'contextMenu')) {
    //     if (event.layerX == event.offsetX && event.layerY == event.offsetY) {
    //       self.pX = (event.clientX + (40 - event.offsetX)) - 186;
    //     }
    //     else {
    //       console.log(event.clientX, event.layerX)
    //       self.pX = (event.clientX + (40 - event.layerX)) - 186;
    //     }
    //     self.pY = 130;

    //     self.visible = true;
    //     self.sortactive = 'sort-active';
    //     self.filteractive = '';
    //   }
    //   else {
    //     self.sortactive = '';
    //     self.visible = false;
    //   }
    //   self.setState({ change: true });

    // });
  }

  getOffset(e) {
    let el = e.target,
      x = 0,
      y = 0;

    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }

    x = e.clientX - x;
    y = e.clientY - y;

    return { x: x, y: y };
  }

  handleSort(event) {
    event.stopPropagation();
    const offset = this.getOffset(event);
    const layerX = 40 - offset.x > 0 ? 40 - offset.x : 20;
    this.pX = (event.clientX + layerX) - 186;
    this.pY = 130;
    this.visible = !this.visible;
    this.sortactive = this.sortactive ? '' : 'sort-active';
    this.filteractive = '';
    this.setState({ change: true });
  }

  handleOutsideClick(e) {
    if (!e.target.attributes['data-popup']) {
      debugger
      this.visible = false;
      this.sortactive = '';
      this.filteractive = '';
    }
  }
  renderMenu(items: any) {
    const myStyle = {
      position: 'absolute',
      top: `${this.pY}px`,
      left: `${this.pX}px`,
      zIndex: 1000,

    } as React.CSSProperties;

    return (
      <div className="custom-context" style={myStyle} >
        <div>
          <div className="custom-context-item">Sort by:</div>
        </div>
        {
          items.map((item, index, arr) => {
            if (arr.length - 1 == index) {
              return (
                <div
                  key={index}
                  className="custom-context-item-last"
                  onClick={() => {
                    item.selected = true;
                  }}
                >
                  <div className="content-item" >
                    {item.label}
                    {
                      item.selected ? <CeIcon.SortDownIcon /> : <CeIcon.SortUpIcon />
                    }
                  </div>
                </div>
              )
            }
            return (
              <div
                key={index}
                className="custom-context-item-last"
                onClick={() => {
                  item.selected = true;
                }}
              >
                <div className="content-item" >
                  {item.label}
                  {
                    item.selected ? <CeIcon.SortDownIcon /> : <CeIcon.SortUpIcon />
                  }
                </div>
              </div>
            )
            })
          }
      </div >
    )
  }
  public render() {
    return (
      <div className="left-item">
        <div className="left-item-body d-flex">
          <div className="form-control-search mr-2 w-100" >
            <img src={search} />
            <input className="ce-form-control " placeholder="Search"></input>
          </div>

          <div className="btn-group">
            {
              this.props.hasFilter &&

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  this.filteractive = this.filteractive ? '' : 'filter-active';
                  this.sortactive = '';
                  this.visible = false;
                  if (this.props.onFilterRaised) {
                    this.props.onFilterRaised();
                  }
                }}
                className={'btn border d-flex align-items-center ' + this.filteractive}
                type="button"
              >
                {
                  this.filteractive == '' ? <CeIcon.FilterIcon /> : <CeIcon.FilterWhiteIcon />
                }
              </button>
            }
            {
              this.props.hasSort &&
              <button
                data-popup
                id="contextMenu"
                ref={this.contextRef}
                onClick={(e) => {
                  this.handleSort(e);
                }}
                className={'btn border d-flex align-items-center ' + this.sortactive}
                type="button"
              >

                {
                  this.sortactive == '' ? <CeIcon.SortSolidIcon /> : <CeIcon.SortSolidWhiteIcon />
                }
              </button>

            }
          </div>
        </div>
        {
          this.visible && this.renderMenu(this.items)
        }
      </div>
    );
  }
}
export default SearchComponent;
