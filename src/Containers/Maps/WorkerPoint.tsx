import React, { useState } from 'react';
import { InfoWindow, Marker } from 'react-google-maps';
import isUndefined from 'lodash/isUndefined';
import { WORKER_STATUS } from '../../Constants/worker';
import PinIcon from './pin.png';
import UserAvatar from '../../Images/user_avatar.png';

interface Props {
  position: { lat: number, long: number };
  info: any;
  google: any;
  worker: any;
}

const WorkerPoint: React.FC<Props> = ({ position, info, google, worker }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleMouseOver = () => {
    setShowInfo(true);
  };
  const handleMouseExit = () => {
    setShowInfo(false);
  };

  const avatarImage = new google.maps.MarkerImage(
    worker.worker.avatar ? worker.avatar : UserAvatar,
    new google.maps.Size(30, 50),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 48),
    new google.maps.Size(24, 24)
  )

  return (
    <>
      <Marker
        position={position}
        icon={{ url: PinIcon, scaledSize: new google.maps.Size(30, 50) }}
        onClick={() => {
            setShowInfo(true);
        }}
      >
      <>
        {showInfo && info.distance && info.duration && (
          <InfoWindow onCloseClick={() => setShowInfo(false)}>
            <div className="d-flex align-items-center">
              <img src={worker.worker.avatar ? worker.avatar : UserAvatar} className="mr-2" style={{ height: 40, width:40 }}/>
              <div>
                <div>{isUndefined(worker.worker.name) ? '' : worker.worker.name}</div>
                <div>{isUndefined(worker.status) ? '' : WORKER_STATUS[worker.status]}</div>
                <div>{isUndefined(worker.worker.phoneNumber) ? '' : <a href={'tel:+' + worker.worker.phoneNumber }>{worker.worker.phoneNumber}</a>}</div>
                <div>{info.duration.text}</div>
                <div>{isUndefined(worker.worker.email) ? '' : worker.worker.email}</div>
              </div>
            </div>
          </InfoWindow>
        )}
        </>
      </Marker>
      <Marker
        position={position}
        icon={avatarImage}
        onClick={() => {
            setShowInfo(true);
        }}
      />
    </>
  );
};

export default WorkerPoint;

