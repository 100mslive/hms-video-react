import React from 'react';
import { CamOffIcon } from '../components/Icons';
import HMSLogger from './ui-logger';

export class BrowserOSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrowserOSError';
  }
}

export const isBrowserOSValid = () => {
  const agent = navigator.userAgent.toLowerCase();
  const isChrome = agent.indexOf('chrome') > -1;
  const isSafari = agent.indexOf('safari') !== -1 && !isChrome;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const safariVersion = parseInt(
    (function() {
      var ua = navigator.userAgent,
        tem,
        M =
          ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
          ) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return `IE ${tem[1] || ''}`;
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) {
          return tem
            .slice(1)
            .join(' ')
            .replace('OPR', 'Opera');
        }
      }
      M = M[2] ? [M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
      }
      return M;
    })() as string,
  );

  if (isChrome && isIOS) {
    throw new BrowserOSError('iOSChromeError');
  } else if (isSafari && safariVersion < 14) {
    throw new BrowserOSError('iOSSafariError');
  } else {
    return true;
  }
};

const localStreamErrors = new Map();

localStreamErrors.set('iOSChromeError', {
  title: 'Chrome on iOS not supported!',
  message:
    'Chrome on iOS does not support video conferencing. Please use Safari to open this link',
});

localStreamErrors.set('iOSSafariError', {
  title: 'Safari < 14 Version not supported!',
  message:
    'This version of Safari is not supported by 100ms. Please upgrade to the latest version. Choose Settings App > General tab > Software Update > Download and Install.',
});

const getLocalStreamException = (errorName: any) => {
  let errorMessage = null;
  if (errorName.length > 0) {
    errorMessage = localStreamErrors.get(errorName);
  } else {
    //other errors
    errorMessage = {
      title: 'Unable to access camera/microphone!',
      message: 'Please switch your device and try again.',
    };
  }
  HMSLogger.e('LocalStream error: ', { error: errorName, ...errorMessage });
  return errorMessage;
};

let getUserMedia = (constraints: MediaStreamConstraints | undefined) => {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  var n = navigator as any;
  if (n.mediaDevices === undefined) {
    n.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (n.mediaDevices.getUserMedia === undefined) {
    n.mediaDevices.getUserMedia = function(
      constraints: MediaStreamConstraints,
    ) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia = n.webkitGetUserMedia || n.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser'),
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(n, constraints, resolve, reject);
      });
    };
  }
  return n.mediaDevices.getUserMedia(constraints);
};

export { getLocalStreamException, getUserMedia };
