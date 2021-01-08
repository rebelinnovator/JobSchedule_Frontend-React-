import React, { useEffect, useState } from 'react';
import ChevronDown from '../../../Images/chevron-down.png';
import './select.scss';
import { JOB_STATUSES } from '../../../Constants/job';


const Select = ({ status, options, onSelect, isWorkerStatus }:
  { status: string, options: string[], isWorkerStatus?: boolean, onSelect?: (status: string) => void }) => {

  const [dropDown, setDropDown] = useState(false);
  const [selectStatus, setSelectStatus] = useState(status);

  const handleSelect = (newStatus) => {

    setDropDown(false);

    if (onSelect) {
      onSelect(newStatus);
    }
  };

  useEffect(() => {
    setSelectStatus(status)
  }, [status]);

  const renderOptions = (options) => (
    <div className="status-select__list cursor-pointer">
      {
        options.map((option, index) => (
          <div
            key={`${option}${index}`}
            className="status-select__items d-flex align-items-center"
            onClick={(e) => {
              e.stopPropagation();
              if (isWorkerStatus) {
                handleSelect(option);
              } else {
                handleSelect(JOB_STATUSES[option]);
              }
            }}
          >
            <span className={`mr-2 circle-${option.toLowerCase()}`}></span>
            {option}
          </div>
        ))
      }
    </div>
  )

  return (
    <>
      <div className="d-flex align-items-center mr-3">
        <div className={`mr-2 circle-${selectStatus.toLowerCase()}`}></div>
        <div className="status-select">
          <div className="status-select__title d-flex align-items-center">
            <div className="name mr-2 cursor-pointer" onClick={(e) => {
              e.stopPropagation();
              setDropDown(!dropDown);
            }}>{selectStatus}</div>
          </div>
          {
            dropDown && renderOptions(options)
          }
        </div>
      </div>
      <img onClick={(e) => {
        e.stopPropagation();
        setDropDown(!dropDown);
      }} src={ChevronDown} alt="" className="cursor-pointer" />
    </>
  )
}
export default Select;
