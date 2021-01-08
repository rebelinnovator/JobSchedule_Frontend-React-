import React, { Component } from 'react';
import { userAPI } from '../../../Services/API';
import { User } from '../../../Models';

interface IProps {
  id: string;
}
export default class UserSmallComponent extends Component<IProps> {
  state: { worker: User; loading: boolean } = {
    worker: null,
    loading: true
  };

  componentDidMount = async () => {
    try {
      if (!this.props.id || this.props.id === '-') {
        this.setState({ worker: null, loading: false });
        return;
      }
      const response = await userAPI.user(this.props.id);
      this.setState({ worker: response.data, loading: false });
    } catch (error) {}
  };
  render() {
    const { worker, loading } = this.state;
    return (
      <div>
        {worker ? (
          <p>
            {worker.firstName} {worker.lastName}
          </p>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          this.props.id
        )}
      </div>
    );
  }
}
