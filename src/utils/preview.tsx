import React from 'react';
import { CamOffIcon } from '../icons';

const NotAllowedMessage = () => {
  return (
    <ol className="flex flex-col">
      <li className="inline-block flex">
        Click the camera blocked icon
        <div className="space-x-4 ml-2 mr-2"><CamOffIcon/></div> in your browser's
        address bar.
      </li>
      <li className="flex "> Allow access and refresh the page.</li>
    </ol>
  );
};

const localStreamErrors = new Map();
//required track is missing
localStreamErrors.set('NotFoundError', {
  title: 'Camera/Microphone not detected!',
  message:
    'We were unable to detect any camera/microphone devices. Please connect and try again.',
});
//webcam or mic are already in use
localStreamErrors.set('NotReadableError', {
  title: 'Camera/Microphone not accessible!',
  message:
    'Please close any other application using camera/microphone and refresh the page.',
});
//constraints can not be satisfied by avb. devices
localStreamErrors.set('OverconstrainedError', {
  title: 'Invalid Audio/Video constraints',
  message: 'The constraints provided for audio/video cannot be met.',
});
//permission denied in browser
localStreamErrors.set('NotAllowedError', {
  title: 'Your camera/microphone is blocked',
  message:
    'We need access to your camera/microphone so that other participants can see and hear you.',
  secondaryMessage: NotAllowedMessage,
  secondaryMessageSafari:
    "Meet requires access to your camera/mic. Choose 'Safari' > Settings for this website.",
});
// returning null continues the call without error modal.

localStreamErrors.set('Error', {
  title: 'Camera/Microphone not accessible!',
  message: "We don't support Chrome on iOS device, please switch to Safari.",
});

localStreamErrors.set('iOSChromeError', {
  title: 'Chrome on iOS not supported!',
  message:
    'Chrome on iOS does not support video conferencing. Please use Safari to open this link',
});

localStreamErrors.set('iOSSafariError', {
  title: 'Safari <14 Version not supported!',
  message:
    'This version of Safari is not supported by 100ms. Please upgrade to the latest version. Choose Settings App > General tab > Software Update > Download and Install.',
});

localStreamErrors.set('TypeError', {
  title: 'Unable to access camera/microphone!',
  message: 'Please switch your device and try again.',
});

const getLocalStreamException = (errorName: any, browser: boolean) => {
  let errorMessage = null;
  if (errorName.length > 0) {
    errorMessage = localStreamErrors.get(errorName);
    if (errorName === 'NotAllowedError') {
      errorMessage['secondaryMessage'] = browser
        ? errorMessage['secondaryMessageSafari']
        : errorMessage['secondaryMessage'];
    }
  } else {
    //other errors
    errorMessage = {
      title: 'Unable to access camera/microphone!',
      message: 'Please switch your device and try again.',
    };
  }
  console.log('LocalStream error: ', { error: errorName, ...errorMessage });
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
