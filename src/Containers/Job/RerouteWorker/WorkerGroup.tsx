import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import { createBrowserHistory } from 'history';
import mapmarkeraltsolid from '../../../Images/map-marker-alt-solid.png';
import { JobWorker, JobLocation } from '../../../Models/jobListItem';
import CheckboxComponent from '../../Components/Controls/Checkbox.Component';
import { WORKER_STATUS } from '../../../Constants/worker';
import CEModal from '../../Components/Modal/Modal.Component';
import CloseIcon from '../../../Images/close-regular.png';
import ModalForm from '../RerouteWorker/ModalForm';
import { jobAPI } from '../../../Services/API';
import * as CeIcon from '../../../Utils/Icon';

import './WorkerGroup.scss';
import { LocationItem } from '../../../Models/locationItem';
import userStore from '../../../Stores/userStore';
import jobStore from '../../../Stores/jobStore';
import {worker} from 'cluster';

interface Props {
  groups: Array<any>;
  jobId: string;
  jobDetail?: any;
  onSaveSuccess: () => void;
  hasSeen?: boolean;
}

const WorkerGroup: React.FC<Props> = ({
  groups,
  jobId,
  onSaveSuccess,
  hasSeen,
  jobDetail,
}) => {
  const [opened, setOpened] = useState(false);
  const [isToggleModal, setisToggleModal] = useState(false);
  const [isUpdateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [newLocations, setNewLocations] = useState({});

  const openJobDetail = (jobId, workerId) => {
    createBrowserHistory({ forceRefresh: true }).push(
      `/job/${jobId}?workerId=${workerId}`
    );
  };

  const closeModal = () => {
    setisToggleModal(false);
  };

  const openModal = () => {
    setisToggleModal(true);
  };

  const handleSelectWorker = (worker: JobWorker) => {
    const index = selectedWorkers.findIndex(
      (item) => item.workerId === worker.workerId
    );
    if (index > -1) {
      setSelectedWorkers((prevState) => {
        const newState = prevState.filter(
          (item) => item.workerId !== worker.workerId
        );
        return newState;
      });
    } else {
      setSelectedWorkers((prevState) => [...prevState, worker]);
    }
  };

  const onChangeLocations = (location) => {
    console.log(location);
    setNewLocations(location);
  };

  const openWorkerDetail = (workerId) => {
    createBrowserHistory({ forceRefresh: true }).push(`/workers/${workerId}`);
  };

  const handleClickReroute = async () => {
    const workerIds = selectedWorkers.map((worker) => worker.workerId);
    const data = {
      workers: [{ jobId, workerIds }],
      location: { ...newLocations },
    };
    try {
      await jobAPI.rerouting(data);
      setisToggleModal(false);
      setNewLocations([]);
      setSelectedWorkers([]);
      onSaveSuccess();
    } catch (e) {}
  };

  const handleDuplicateJob = async () => {
    const workerIds = selectedWorkers.map((worker) => worker.workerId);
    const data = {
      workers: [{ jobId, workerIds }],
      location: { ...newLocations },
    };

    const _location: any = newLocations;

    const checkLocation = jobDetail.locations.filter(
      (loca) => loca.address === _location.address
    );
    const locationIndex = jobDetail.locations.indexOf(checkLocation[0]);
    if (locationIndex < 0) {
      jobDetail.locations = [_location];
    }

    const newWorkers = [];
    for (let i = 0; i < jobDetail.workers.length; i++) {
      const worker = jobDetail.workers[i];
      if (workerIds.indexOf(worker.workerId) > -1) {
        worker.location = newLocations;
        worker.locationID =
          locationIndex > -1 ? locationIndex : jobDetail.locations.length + 1;
        // worker.jobStatus = 0;
        worker.status = 0;
        newWorkers.push(worker);
      }
    }

    jobDetail.workers = newWorkers;

    // const duplicateJob = await jobAPI.create({ jobs: [jobDetail] })

    // if (duplicateJob.statusText === 'OK') {
    //   const newJob = duplicateJob.data[0]
    //   createBrowserHistory({ forceRefresh: true }).push(`/job/${jobDetail.id}/copy`);
    // }

    const duplicateJob: any = {
      newWorkers,
      workerIds: workerIds,
      newLocations,
    };

    localStorage.setItem('duplicateJob', JSON.stringify(duplicateJob));
    createBrowserHistory({ forceRefresh: true }).push(
      `/job/${jobDetail.id}/copy`
    );
  };

  const locationCurrent: any = newLocations;

  const isShowUpdateWorkerStatus = userStore.me.roles.some(role => [5, 6, 8].includes(role));

  const isWorkerStatusUpdatable = (worker) => worker && worker.status < 7;

  const getWorkerNextStatus = (worker) => {
    return worker && worker.status + (worker.status === 5 ? 2 : 1);
  };

  const handleUpdateWorkerStatus = async () => {
    setUpdateStatusModalOpen(false);
    if (selectedWorkers) {
      const workersToUpdate = jobDetail.workers.map(async worker => {
        if (
            selectedWorkers.some(
                selectedWorker => selectedWorker.workerId === worker.workerId && selectedWorker.status < 7
            )
        ) {
          const {data: job} = await jobAPI.updateWorkers(jobId, {
            ...worker,
            date: worker.startDate,
            status: getWorkerNextStatus(worker)
          });
          return job.workers.find(jodWorker => jodWorker.workerId === worker.workerId);
        }
        return worker;
      });
      const workers = await Promise.all(workersToUpdate);

      console.log('workers =====>', workers);
      await jobStore.updateProjects(jobId, {workers});
      setSelectedWorkers([]);
    }
  };
  
  const getUpdateWorkerStatusButtonName = () => {
    const [worker] = selectedWorkers && selectedWorkers.filter(selectedWorker => selectedWorker.status < 7);
    return worker ? `Update to ${WORKER_STATUS[getWorkerNextStatus(worker)]}` : 'Update no available';
  };

  const getUpdateWorkerStatusModalMessage = () => {
    const workers = selectedWorkers && selectedWorkers.filter(worker => worker.status < 7);
    const workersStatusString = workers.map(
        worker =>
            `${worker.worker.name} status from "${WORKER_STATUS[worker.status]}" to "${WORKER_STATUS[getWorkerNextStatus(worker)]}"`
    ).join(', ');
     return `Do you want to change the worker ${workersStatusString} ?`;
  };

  return (
    <>
      <div className="worker-group">
        {groups.map((group, gIdx) =>
          group.workers.length <= 1 ? (
            <div
              key={String(gIdx)}
              className="border-top d-flex flex-sm-row flex-column align-items-center pr-3"
            >
              <div className="job-location d-flex align-items-center mr-auto">
                <div className="logo-location d-flex mr-2">
                  <img src={mapmarkeraltsolid} className="m-auto"></img>
                </div>
                <div className="flex-mobile">
                  <div className="mr-1 logo-location-address">
                    <span>- {group.location.address}</span>
                  </div>
                </div>
              </div>
              {group.workers.map((worker, id) => (
                <div
                  key={String(worker.workerId + id)}
                  className="d-flex justify-content-start align-items-center ml-4"
                >
                  <div>
                    <CheckboxComponent
                      checked={Boolean(
                        selectedWorkers.find(
                          (item) => item.workerId === worker.workerId
                        )
                      )}
                      id={worker.workerId}
                      className="mr-3"
                      onChange={() => handleSelectWorker(worker)}
                    />
                  </div>
                  <div
                    className="mr-3"
                    onClick={() => openWorkerDetail(worker.workerId)}
                  >
                    <img
                      className="avatar"
                      alt="avatar"
                      src={`${process.env.REACT_APP_API_ENDPOINT}${worker.worker.avatar}`}
                    ></img>
                  </div>
                  <div>
                    <div>
                      {worker.worker.name}
                      {worker.hasSeen && (
                        <CeIcon.DobuleTickIcon
                          className="has-seen ml-3"
                          fill="green"
                        />
                      )}
                    </div>
                    <div className="status">{WORKER_STATUS[worker.status]}</div>
                    <a href={`tel:${worker.worker.phoneNumber}`}>
                      {worker.worker.phoneNumber}
                    </a>
                  </div>
                </div>
              ))}
              <div className="worker-link">
                {group.workers[0] && (
                  <div
                    onClick={() =>
                      openJobDetail(jobId, group.workers[0].workerId)
                    }
                  />
                )}
              </div>
              {selectedWorkers.length > 0 && gIdx === 0 && (
                  <div>
                    {
                      isShowUpdateWorkerStatus
                      && selectedWorkers.some(worker => isWorkerStatusUpdatable(worker))
                      && (
                          <button className="button-update-status" onClick={() => setUpdateStatusModalOpen(true)}>
                            {getUpdateWorkerStatusButtonName()}
                          </button>
                      )
                    }
                    <button onClick={openModal} className="button-submit mb-3">
                      Re-Route Selected Worker
                    </button>
                  </div>
              )}
            </div>
          ) : (
            <div className="d-flex" key={String(gIdx)}>
              <Collapsible
                trigger={
                  <div className="d-flex align-items-center justify-content-start border-top pr-3">
                    <div className="button font-weight-bold border-right d-flex align-items-center px-2">{`${
                      opened ? '-' : '+'
                    } (${group.workers.length})`}</div>
                    <div className="job-location d-flex align-items-center mr-4">
                      <div className="logo-location d-flex mr-2">
                        <img src={mapmarkeraltsolid} className="m-auto"></img>
                      </div>
                      <div className="d-flex flex-mobile">
                        <div className="mr-1 logo-location-address">
                          <span>- {group.location.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex worker-link">
                      {group.workers.map((worker, idx) => (
                        <div
                          key={String(idx + worker.worker.id)}
                          className="avatar-wrapper"
                          style={{ zIndex: group.workers.length - idx }}
                          onClick={() => openWorkerDetail(worker.workerId)}
                        >
                          <img
                            className="avatar"
                            alt="avatar"
                            src={`${process.env.REACT_APP_API_ENDPOINT}${worker.worker.avatar}`}
                          ></img>
                        </div>
                      ))}
                    </div>
                    {selectedWorkers.length > 0 && gIdx === 0 && (
                        <div>
                          {
                            isShowUpdateWorkerStatus
                            && selectedWorkers.some(worker => isWorkerStatusUpdatable(worker))
                            && (
                                <button className="button-update-status" onClick={() => setUpdateStatusModalOpen(true)}>
                                  {getUpdateWorkerStatusButtonName()}
                                </button>
                            )
                          }
                          <button onClick={openModal} className="button-submit">
                            Re-Route Selected Worker
                          </button>
                        </div>
                    )}
                  </div>
                }
                onOpen={() => setOpened(true)}
                onClose={() => setOpened(false)}
                easing="ease"
                className="collaped-content"
              >
                <div className="">
                  {group.workers.map((worker, id) => (
                    <div
                      key={String(worker.workerId + id)}
                      className="d-flex border-top job-item justify-content-start align-items-center"
                    >
                      <div>
                        <CheckboxComponent
                          checked={Boolean(
                            selectedWorkers.find(
                              (item) => item.workerId === worker.workerId
                            )
                          )}
                          id={worker.workerId}
                          className="mr-3"
                          onChange={() => handleSelectWorker(worker)}
                        />
                      </div>
                      <div
                        className="mr-3"
                        onClick={() => openWorkerDetail(worker.workerId)}
                      >
                        <img
                          className="avatar"
                          alt="avatar"
                          src={`${process.env.REACT_APP_API_ENDPOINT}${worker.avatar}`}
                        ></img>
                      </div>
                      <div>
                        <div>
                          {worker.worker.name}
                          {worker.hasSeen && (
                            <CeIcon.DobuleTickIcon
                              className="has-seen ml-3"
                              fill="green"
                            />
                          )}
                        </div>
                        <div className="status">
                          {WORKER_STATUS[worker.status]}
                        </div>
                        <a href={`tel:${worker.worker.phoneNumber}`}>
                          {worker.worker.phoneNumber}
                        </a>
                      </div>
                      <div
                        className="worker-link"
                        onClick={() => openJobDetail(jobId, worker.workerId)}
                      />
                    </div>
                  ))}
                </div>
              </Collapsible>
            </div>
          )
        )}
      </div>

      {isToggleModal && (
        <CEModal show={isToggleModal} onClose={closeModal} size="modal-lg">
          <div className="p-3 pt-0">
            <div className="ce-flex-right">
              <a className="pull-right" onClick={closeModal}>
                <img src={CloseIcon} />
              </a>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div className="font-weight-bold mr-3">Re-Routing: </div>
              {selectedWorkers.map((worker) => (
                <div
                  key={String(worker.workerId)}
                  className="d-flex mr-3 justify-content-start align-items-center"
                >
                  <div className="mr-3">
                    <img
                      className="avatar"
                      alt="avatar"
                      src={`${process.env.REACT_APP_API_ENDPOINT}${worker.worker.avatar}`}
                    ></img>
                  </div>
                  <div>
                    <div>
                      {worker.worker.name}
                      {hasSeen && (
                        <CeIcon.DobuleTickIcon
                          style={{
                            fontSize: 32,
                            width: '50px',
                            height: 'auto',
                          }}
                          className="has-seen ml-3"
                          fill="green"
                        />
                      )}
                    </div>
                    <div className="status">{WORKER_STATUS[worker.status]}</div>
                    <a href={`tel:${worker.worker.phoneNumber}`}>
                      {worker.worker.phoneNumber}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <ModalForm
              location={newLocations as LocationItem}
              onChangeLocations={onChangeLocations}
              withMap
            />

            <div className="text-center actions">
              <button
                type="button"
                className="btn btn-success btn-add height-42"
                onClick={handleClickReroute}
                disabled={
                  locationCurrent && locationCurrent.address ? false : true
                }
              >
                Save Current Job
              </button>
              <button
                type="button"
                className="btn btn-primary btn-add height-42"
                onClick={handleDuplicateJob}
                style={{ marginLeft: 24 }}
                disabled={
                  locationCurrent && locationCurrent.address ? false : true
                }
              >
                Create New Job
              </button>
            </div>
          </div>
        </CEModal>
      )}

      {
        isUpdateStatusModalOpen && (
            <CEModal
                size="modal-lg"
                show={isUpdateStatusModalOpen}
                onClose={() => setUpdateStatusModalOpen(false)}>
              <div className="p-3 pt-0">
                <p className="text-center">
                  {getUpdateWorkerStatusModalMessage()}
                </p>
                <div className="text-center actions">
                  <button
                      type="button"
                      className="btn btn-success btn-add height-42"
                      onClick={() => setUpdateStatusModalOpen(false)}
                  >
                    No
                  </button>
                  <button
                      type="button"
                      className="btn btn-primary btn-add height-42"
                      onClick={handleUpdateWorkerStatus}
                      style={{ marginLeft: 24 }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </CEModal>
        )
      }
    </>
  );
};

export default WorkerGroup;
