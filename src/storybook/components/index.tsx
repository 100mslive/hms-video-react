// import React, { useEffect, useRef, useState } from 'react';
// import { Story } from '@storybook/react';

// export interface DummyVideoContextProps {
//   dummyVideoRef: React.RefObject<HTMLVideoElement>;
//   stream: MediaStream | undefined;
//   updateStream: (stream: MediaStream | undefined) => void;
// }

// const DummyVideoContext = React.createContext<DummyVideoContextProps>({
//   dummyVideoRef: React.createRef(),
//   stream: new MediaStream(),
//   updateStream: (stream: MediaStream | undefined) => {},
// });

// const addDummyVideos = (Story: Story) => {
//   const [stream, setStream] = useState<MediaStream>();
//   const updateStream = (stream: MediaStream | undefined) => {
//     setStream(stream);
//   };
//   useEffect(() => {
//     console.log('Calling dummy videos', Story.args);
//   });
//   const dummyVideoRef = useRef<HTMLVideoElement>(null);
//   return (
//     <>
//       {/* TODO move dummy videos to providers*/}
//       {/* <video
//           crossOrigin="anonymous"
//           className="hidden"
//           width="400"
//           height="225"
//           ref={dummyVideoRef}
//           loop
//           autoPlay
//           onPlay={() => {
//             if (dummyVideoRef && dummyVideoRef.current) {
//               //@ts-ignore
//               setStream(dummyVideoRef.current.captureStream());
//             }
//           }}
//         ></video>             */}
//       <DummyVideoContext.Provider
//         value={{ dummyVideoRef, stream, updateStream }}
//       >
//         <Story />
//       </DummyVideoContext.Provider>
//     </>
//   );
// };

// export { DummyVideoContext, addDummyVideos };
