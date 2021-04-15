import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CustomArrowProps } from 'react-slick';

export const MicOff = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.97617 12V11.1235L9.61666 12.8324C9.85825 13.5241 10.3925 14.0786 11.071 14.3473L12.6329 15.9743C12.4267 16.0069 12.2153 16.0238 12 16.0238C9.77769 16.0238 7.97617 14.2223 7.97617 12ZM14.5238 5.96429V10.7515L16.0126 12.3023C16.02 12.2025 16.0238 12.1017 16.0238 12V5.96429C16.0238 3.74201 14.2223 1.94049 12 1.94049C10.3699 1.94049 8.96613 2.90984 8.33379 4.30356L9.51306 5.53196C9.71811 4.34408 10.7535 3.44049 12 3.44049C13.3938 3.44049 14.5238 4.57044 14.5238 5.96429ZM12.0387 17.9573C12.7835 17.9526 13.4959 17.8111 14.1521 17.5568L15.2587 18.7095C14.4875 19.0848 13.6419 19.3311 12.75 19.4202V22.0595C12.75 22.4737 12.4142 22.8095 12 22.8095C11.5858 22.8095 11.25 22.4737 11.25 22.0595V19.4202C7.48415 19.0441 4.54365 15.866 4.54365 12.0011V9.98254C4.54365 9.56833 4.87944 9.23254 5.29365 9.23254C5.70786 9.23254 6.04365 9.56833 6.04365 9.98254V12.0011C6.04365 15.2778 8.6895 17.9365 11.9613 17.9573C11.9741 17.9567 11.987 17.9563 12 17.9563C12.013 17.9563 12.0259 17.9567 12.0387 17.9573ZM17.6206 13.9774L18.756 15.1601C19.2053 14.2009 19.4563 13.1303 19.4563 12.0011V9.98254C19.4563 9.56833 19.1205 9.23254 18.7063 9.23254C18.2921 9.23254 17.9563 9.56833 17.9563 9.98254V12.0011C17.9563 12.6938 17.8381 13.3589 17.6206 13.9774ZM4.40979 2.79882C4.12293 2.50001 3.64815 2.49032 3.34935 2.77718C3.05054 3.06403 3.04085 3.53881 3.3277 3.83762L20 21.0604C20.2868 21.3593 20.7616 21.3689 21.0604 21.0821C21.3592 20.7952 21.3689 20.3205 21.0821 20.0216L4.40979 2.79882Z"
      fill="white"
    />
  </svg>
);

export const MicOn = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5238 12V5.96429C14.5238 4.57044 13.3939 3.44049 12 3.44049C10.6061 3.44049 9.4762 4.57043 9.4762 5.96429V12C9.4762 13.3938 10.6061 14.5238 12 14.5238C13.3939 14.5238 14.5238 13.3939 14.5238 12ZM12 1.94049C9.77771 1.94049 7.9762 3.74201 7.9762 5.96429V12C7.9762 14.2223 9.77771 16.0238 12 16.0238C14.2223 16.0238 16.0238 14.2223 16.0238 12V5.96429C16.0238 3.74201 14.2223 1.94049 12 1.94049ZM11.25 19.4202V22.0595C11.25 22.4737 11.5858 22.8095 12 22.8095C12.4142 22.8095 12.75 22.4737 12.75 22.0595V19.4202C16.5158 19.0441 19.4563 15.866 19.4563 12.0011V9.98254C19.4563 9.56833 19.1206 9.23254 18.7063 9.23254C18.2921 9.23254 17.9563 9.56833 17.9563 9.98254V12.0011C17.9563 15.2778 15.3105 17.9365 12.0387 17.9573C12.0259 17.9567 12.013 17.9563 12 17.9563C11.987 17.9563 11.9741 17.9567 11.9613 17.9573C8.68952 17.9365 6.04367 15.2778 6.04367 12.0011V9.98254C6.04367 9.56833 5.70788 9.23254 5.29367 9.23254C4.87946 9.23254 4.54367 9.56833 4.54367 9.98254V12.0011C4.54367 15.866 7.48417 19.0441 11.25 19.4202Z"
      fill="white"
    />
  </svg>
);

export function SliderRightArrow(props: CustomArrowProps) {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow absolute top-1/2 right-0 z-2"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button className="text-2xl bg-white rounded-sm">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}

export function SliderDownArrow(props: CustomArrowProps) {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow absolute top-1/2 right-0 z-2"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button className="text-2xl bg-white rounded-sm">
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  );
}

export function SliderUpArrow(props: CustomArrowProps) {
  const { style, onClick } = props;
  return (
    <div
      className=" top-1/2 z-10 absolute"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button className="text-2xl bg-white rounded-sm">
        <FontAwesomeIcon icon={faChevronUp} />
      </button>
    </div>
  );
}

export function SliderLeftArrow(props: CustomArrowProps) {
  const { style, onClick } = props;
  return (
    <div
      className=" top-1/2 z-10 absolute"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button className="text-2xl bg-white rounded-sm">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
    </div>
  );
}
