import React from 'react';
import ReactTooltip from 'react-tooltip';
import isUndefined from 'lodash/isUndefined';
import { WORKER_STATUS } from '../../../Constants/worker';
import MapMaker from '../../../Images/map-marker.png';
import UserAvatar from '../../../Images/user_avatar.png';
import './WorkerMaker.scss';

interface Props {
	lat?: number;
	lng?: number;
	worker: any;
}

const WorkerMarker: React.FC<Props> = ({ worker }) => {
	return (
		<>
			<div
				style={{ backgroundImage: `url(${MapMaker})` }}
				className="worker-marker"
				data-tip={`${isUndefined(worker.worker.name) ? '' : worker.worker.name}<br/>${isUndefined(worker.status) ? '' : WORKER_STATUS[worker.status]}<br/>${isUndefined(worker.worker.phoneNumber) ? '' : worker.worker.phoneNumber}<br/> ${isUndefined(worker.worker.email) ? '' : worker.worker.email}`}
				data-for="tooltip"
			>
				<img src={worker.avatar ? worker.avatar : UserAvatar} className="worker-avatar" />
			</div>
			<ReactTooltip id="tooltip" place="top" type="info" effect="solid" multiline />
		</>
	);
};

export default WorkerMarker;
