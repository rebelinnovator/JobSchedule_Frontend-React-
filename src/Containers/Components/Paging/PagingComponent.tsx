import * as React from 'react';
import Pagination from 'react-js-pagination';

interface IProps {
  onChangePage: (page: number) => void;
  itemsCountPerPage?: number;
  totalItemsCount?: number;
  pageRangeDisplayed?: number;
  activePage?: number;
}

interface IState {
  activePage: number;
}

export class PagingComponent extends React.Component<IProps, IState> {
  static defaultProps = {
    onChangePage: () => { },
    itemsCountPerPage: 10,
    totalItemsCount: 0,
    pageRangeDisplayed: 3,
  };
  constructor(props) {
    super(props);
    this.state = {
      activePage: props.activePage != null ? props.activePage : 1,
    };
  }

  handlePageChange = (pageNumber: number) => {
    this.setState({ activePage: pageNumber });
    this.props.onChangePage(pageNumber);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.activePage !== this.props.activePage) {
      this.setState({
        activePage: this.props.activePage != null ? this.props.activePage : 1,
      });
    }
  }

  public render() {
    return (
      <>
        {this.props.totalItemsCount > this.props.itemsCountPerPage ? (
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.props.itemsCountPerPage}
            totalItemsCount={this.props.totalItemsCount}
            pageRangeDisplayed={this.props.pageRangeDisplayed}
            onChange={this.handlePageChange}
            innerClass={'pagination'}
            itemClass={'page-item'}
            linkClass={'page-link'}
            activeLinkClass={'page-link-no-border'}
          />
        ) : (
            ''
          )}
      </>
    );
  }
}
export default PagingComponent;
