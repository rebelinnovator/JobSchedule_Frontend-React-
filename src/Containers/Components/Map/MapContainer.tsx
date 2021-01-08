/* eslint-disable no-undef */
/* global google */
import React, { Component } from 'react';
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  DirectionsRenderer,
} from 'react-google-maps';
import { observer } from 'mobx-react';
import * as mobx from 'mobx';
import JobLocationMaker from './JobLocationMaker';
import WorkerPoint from '../../Maps/WorkerPoint';
import { jobAPI } from '../../../Services/API';
import { AnyAaaaRecord, resolve } from 'dns';
import { JobListItem } from '../../../Models/jobListItem';
import {createBrowserHistory} from 'history';

const MapWithAMarker = withScriptjs(
  withGoogleMap(({ children, ...props }: any) => (
    <MapDirection children={children} {...props} />
  ))
);
declare var google: any;

@observer
class MapDirection extends Component<any, any> {
  mapControl: any;
  directions: Array<any>;
  directionsService = new google.maps.DirectionsService();
  constructor(props) {
    super(props);
    this.directions = new Array<any>();
    this.mapControl = React.createRef();
    this.state = {
      job: null,
      workerLocations: [],
      directions: [],
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this.setState({ change: true });
    }
  }
  componentDidMount() {}

  componentDidUpdate(preProps) {
    const job = mobx.toJS(this.props.jobSelected);
    if (
      this.props.jobSelected &&
      JSON.stringify(job) !== JSON.stringify(mobx.toJS(preProps.jobSelected))
    ) {
      this.onChangeJob(job);
    }
  }

  async onChangeJob(job) {
    this.setState({
      job: null,
      workerLocations: [],
      directions: [],
    });

    if (job) {
      const workerLocations = [...job.workers];
      this.setState({
        job,
      });
      try {
        const response = await jobAPI.loadTrace(job.id);
        let trace: any[] = Object.values(response.data);
        trace.forEach((traceArray) => {
          let alast = traceArray[traceArray.length - 1];
          workerLocations.forEach((item) => {
            if (item.workerId === alast.workerId) {
              item.trace = alast;
            }
          });
        });
        const directions = await this.findDirections(workerLocations);
        this.setState({
          directions,
          workerLocations,
        });
      } catch (e) {}
    }
  }

  findDirectionByWorker(w) {
    return new Promise((resolve, reject) => {
      if (w.trace && w.trace.location) {
        var origin = {
          lat: Number(w.trace.location.lat),
          lng: Number(w.trace.location.lng),
        };
        this.directionsService.route(
          {
            origin: origin,
            destination: w.location,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              resolve({
                w,
                directions: result
              })
            }
            resolve({
              w,
              directions: null,
            })
          }
        );
      } else {
        resolve (null);
      }
    })
  }

  async findDirections(workerLocations) {
    let results = [];
    for (let i = 0; i < (workerLocations || []).length; i ++) {
      const d = await this.findDirectionByWorker(workerLocations[i]);
      if (d) {
        results.push(d);
      }
    }
    return results;
  }

  renderDirection(d: any, index: number) {
    if (d.directions) {
      var info = d.directions.routes[0].legs[0];
      d.w.jobType = this.state.job.jobType;
      d.w.requestTime = this.state.job.requestTime;
      
      return (
        <React.Fragment key={index}>
          <JobLocationMaker position={d.w.location} jobItem={d.w} onJobClick={(jobItem, event) => {
            if (event === 'double') {
              createBrowserHistory({forceRefresh: true}).push(`/job/${jobItem.id}`);
            }
          }} />
          <DirectionsRenderer
            options={{
              markerOptions: { visible: false },
            }}
            directions={d.directions}
          />
           <WorkerPoint
              position={d.w.trace.location}
              google={google}
              worker={d.w}
              info={info}
            />
        </React.Fragment>
      )
    }
    return (<div />)
  }

  renderJobLocation(jobItem: JobListItem) {
    return jobItem && jobItem.locations.map((location: any, idx) => {
      return (
      <JobLocationMaker
        key={String(idx + location.lat)}
        position={{
          lat: location.lat,
          lng: location.lng
        }}
        jobItem={{...jobItem, location}}
        onJobClick={(jobItem, event) => {
          if (event === 'double') {
            createBrowserHistory({forceRefresh: true}).push(`/job/${jobItem.id}`);
          }
        }}
      />
    )});
  }

  render() {
    const { props, children, defaultZoom, zoom } = this.props;
    const { directions } = this.state
    return (
      <GoogleMap
        defaultZoom={defaultZoom}
        zoom={zoom}
        ref={this.mapControl}
        defaultCenter={this.props.jobLocation}
        center={this.props.jobLocation}
        {...props}
      >
        {children}
        {this.renderJobLocation(this.props.jobSelected)}
        {directions.map((d, index)=> this.renderDirection(d, index))}
        {this.state.workerLocations.filter((worker) => !directions.find(d => d.id === worker.id))
            .map((wl, index)=> {
           return (
               <JobLocationMaker
                   key={String(wl.id)}
                   position={{
                     lat: wl.location.lat,
                     lng: wl.location.lng
                   }}
                   jobItem={{...this.props.jobSelected, location: wl.location}}
                   onJobClick={(jobItem, event) => {
                     if (event === 'double') {
                       createBrowserHistory({forceRefresh: true}).push(`/job/${jobItem.id}`);
                     }
                   }}
               />
           );
        })}
      </GoogleMap>
    );
  }
}

export default class MapContainer extends Component<any> {
  render() {
    const { children, ...props } = this.props;

    return (
      <MapWithAMarker
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_AIP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        {...props}
      >
        {children}
      </MapWithAMarker>
    );
  }
}
