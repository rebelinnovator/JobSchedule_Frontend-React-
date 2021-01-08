import React, { useState } from 'react';
import { JobListItem, JobLocation } from '../../../Models/jobListItem';
import JobPin from './jobPin.png';
import { InfoWindow, Marker } from 'react-google-maps';
import { formatDate, FORMATES } from '../../../Utils/Date';
import { JobType } from '../../../Constants/job';
import { DEVICE_TYPE } from '../../../Utils/Common';
declare var google: any;

type IProps = {
  jobItem: JobListItem,
  position: JobLocation | { lat: number; lng: number; },
  onJobClick?: Function,
};


const JobLocationMaker: React.FC<IProps> = ({ jobItem, position, onJobClick}) => {
  const [isShow, setIsShow] = useState(false)
  const jobDate = formatDate(jobItem.requestTime, FORMATES.date);
  const jobTime = formatDate(jobItem.requestTime, FORMATES.time);
  const address = (jobItem.location ? jobItem.location.address : undefined)
    || (jobItem.locations && jobItem.locations.length > 0 ? jobItem.locations[0].address : '')
  return (
    <Marker
      position={position}
      icon={{ url: JobPin, scaledSize: new google.maps.Size(30, 50) }}
      onClick={() => {
        setIsShow(true);
        onJobClick(jobItem);
      }}

      onDblClick={(e) => {
        setIsShow(true);
        onJobClick(jobItem, 'double');
      }}
      
    >
      {isShow && (<InfoWindow onCloseClick={() => setIsShow(false)}>
        <div className="d-flex align-items-center">
          <div>
            <div>{JobType[jobItem.jobType]}</div>
            <div>{`${jobDate} ${jobTime}`}</div>
            <div>{address}</div>
          </div>
        </div>
      </InfoWindow>)}
    </Marker>
  )
}

JobLocationMaker.defaultProps = {
  onJobClick: () => {},
};
export default JobLocationMaker
