import React from 'react';
import { CloseMessage } from '../../icons';
import {getLocalStreamException} from '../../utils'

export interface MessageModalProps {
  title: string;
  message: string;
  secondary?: string;
  show: boolean;
  onClose?:() => void;
  //   classes?: {
  //     root?: string;
  //     leftRoot?: string;
  //     centerRoot?: string;
  //     rightRoot?: string;
  //   };
}

export const MessageModal = ({
  title,
  message,
  secondary,
  show = false,
  onClose,
}: MessageModalProps) => {
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto "
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
    {show && (<div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed pin z-50 inset-0 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="focus:outline-none inline-block align-bottom text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
          {/* <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-3"> */}
          {/* <div className="sm:flex sm:items-start sm:flex-wrap"> */}

          <div className="flex flex-col md:flex-row md:flex-wrap bg-gray-100 rounded-lg sm:items-start md:w-100 focus:outline-none rounded-tr-lg text-center font-normal pb-4 sm:text-left">
            <div className="flex flex-grow flex-row px-5 pt-5 items-center">
              <div className="flex flex-grow lg:text-2xl sm:text-xl md:h-9 sm:h-7 self-center items-center text-white font-medium">
                {title}
              </div>
              {/* <h3 className="lg:text-2xl sm:text-xl md:h-9 sm:h-7  text-white" id="modal-title">
              {title}
            </h3> */}
              <div className="flex flex-none self-center justify-end items-end right-0 bg-gray-100 hover:bg-gray-200 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full justify-end shadow-sm text-base font-medium rounded-xl focus:outline-none"
                  onClick={() => {
                    if (onClose) {
                      onClose();
                    }
                  }}
                >
                  {CloseMessage}
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-2.5 px-5 py-3">
              <p className="md:text-base text-sm text-gray-500">{message}</p>
              <p className="md:text-base text-sm text-gray-500">{secondary}</p>
            </div>

            {/* </div> */}
            {/* </div> */}
          </div>
        </div>
        
      </div>)}
    </div>
  );
};
