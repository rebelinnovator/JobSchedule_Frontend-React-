/* eslint-disable no-undef */
/* global google */
import { observer } from 'mobx-react';
import * as React from 'react';
import jobStore from '../../Stores/jobStore';
import JobListComponent from '../Job/JobList';
import FilterComponent from '../Searchs/Filter.Component';
import './Map.css';
import { Location } from '../../Models/jobItem';
import mapStore from '../../Stores/mapStore';
import { JobListItem } from '../../Models/jobListItem';
import MapContainer from '../Components/Map/MapContainer';
import { EROLES } from '../../Constants/user';
import JobLocationMaker from '../Components/Map/JobLocationMaker';

declare var google: any;

interface Props {}

@observer
export class CEMap extends React.Component<Props> {
  jobList: boolean;
  map: any;
  location: Location;
  radius: number;
  radiusType: number;
  jobListComponentRef: any;

  constructor(props) {
    super(props);

    this.jobList = true;
    this.jobListComponentRef = React.createRef();
    this.search = this.search.bind(this);
  }
  state: any = {
    zoom: 11,
    mode: 0,
    location: {
      lat: +process.env.REACT_APP_MAP_CENTER_LAT,
      lng: +process.env.REACT_APP_MAP_CENTER_LNG,
    },
    showJobInfo: {},
    searchParams: { page: 0 },
  };

  componentWillUnmount() {
    // mapStore.selectJob(null);
  }

  onZoomChanged = () => {
    this.setState({ zoom: 11 });
  };

  toggle = () => {
    this.setState((state: any) => ({
      mode: state.mode ? 0 : 1,
      location: state.mode
        ? {
            lat: +process.env.REACT_APP_MAP_CENTER_LAT,
            lng: +process.env.REACT_APP_MAP_CENTER_LNG,
          }
        : {
            lat: 46.6558,
            lng: 32.6178,
          },
    }));
    setTimeout(() => this.toggle(), 4000);
  };

  onJobFocus = (po: number) => {
    mapStore.setActive(po);
  };

  onJobBlur = () => {
    mapStore.clearActive();
  };

  handleMouseOver = (jobItem) => {
    this.setState({ [jobItem.id]: true });
  };
  handleMouseExit = (jobItem) => {
    this.setState({ [jobItem.id]: false });
  };

  renderPoint = (jobItem: JobListItem) => {
    return jobItem.locations.map((location: Location, idx) => (
      <JobLocationMaker
        key={String(idx + location.lat)}
        position={{
          lat: location.lat,
          lng: location.lng,
        }}
        jobItem={jobItem}
        onJobClick={(job, click = 'single') => {
          this.jobListComponentRef.current.onClick(job, click, true);
        }}
      />
    ));
  };

  search = async (params: any, keepPage = false) => {
    const searchParams = { ...params };

    await jobStore.getJobsList(searchParams);
    this.setState({ searchParams });
  };

  isSuperVisor() {
    const user = JSON.parse(localStorage.getItem('CurrentUser'));
    if (user.roles && user.roles.includes(EROLES.coned_field_supervisor)) {
      return true;
    }
    return false;
  }

  public render() {
    const { selected } = mapStore;
    const hasSupervisor = this.isSuperVisor();
    let jobs = jobStore.jobs;

    if (this.location && this.radius && this.radiusType) {
      jobs = jobs.filter((item) => {
        if (item.locations && item.locations.length) {
          const targetLoc = new google.maps.LatLng(
            item.locations[0].lat,
            item.locations[0].lng
          );
          const center = new google.maps.LatLng(
            this.location.lat,
            this.location.lng
          );
          const distanceInkm =
            google.maps.geometry.spherical.computeDistanceBetween(
              targetLoc,
              center
            ) / 1000;

          return distanceInkm < this.radius * this.radiusType;
        }
        return false;
      });
    }

    return (
      <div className="d-flex App-content">
        <div className="col-left border-right">
          <FilterComponent
            hasDepartment={true}
            hasRequestDate={true}
            hasJobStatus={true}
            hasWorker={true}
            hasNumber={true}
            hasAdress={true}
            hasBorough={true}
            hasFieldSupervisor={hasSupervisor}
            hasFilter
            hasSort
            search={this.search}
            onFilter={() => {
              this.jobList = false;
              this.setState({ change: true });
            }}
            onFilterByLocation={(location, radius, radiusType) => {
              this.location = location;
              this.radius = radius;
              this.radiusType = radiusType;

              this.setState({});
            }}
          ></FilterComponent>

          <JobListComponent
            ref={this.jobListComponentRef}
            jobs={jobs}
            onJobFocus={this.onJobFocus}
            selectJob={(job: JobListItem) => {
              mapStore.selectJob(job);
              this.setState({ zoom: 10 });
            }}
            onJobBlur={this.onJobBlur}
            active={mapStore.active}
          />
        </div>
        <div className="col-right no-margin p-0">
          <div style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
            <MapContainer
              onZoomChanged={this.onZoomChanged}
              zoom={this.state.zoom}
              defaultZoom={this.state.zoom}
              reference={(map) => (this.map = map)}
              jobLocation={
                (selected && mapStore.jobLocation) || this.state.location
              }
              jobSelected={selected}
            >
              {selected === null && jobs.map(this.renderPoint)}
            </MapContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default CEMap;
