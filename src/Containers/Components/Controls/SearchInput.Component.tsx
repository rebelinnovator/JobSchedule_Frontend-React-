import * as React from 'react';

// import './date.scss';

interface Props {
  title?: string;
  onChange?: (event) => void;
  checked?: boolean;
  className?: string;
  name?: string;
}

export class CETSearchInput extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (

      <div className="ce-search-control">

        <input
          className="ce-search-control-input"
          name={this.props.name}
          value={this.props.title}
          onChange={this.props.onChange} />
      </div>

    );
  }
}

export default CETSearchInput;
