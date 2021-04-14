const getVideoTileLabel = (
  peerName: string,
  isLocal: boolean,
  videoSource: 'screen' | 'camera' | 'canvas',
) => {
  // Map [isLocal, videoSource] to the label to be displayed.
  const labelMap = new Map<string, string>([
    [[true, 'screen'].toString(), 'Your Screen'],
    [[true, 'camera'].toString(), 'You'],
    [[false, 'screen'].toString(), `${peerName}'s Screen`],
    [[false, 'camera'].toString(), peerName],
  ]);

  return labelMap.get([isLocal, videoSource].toString());
};

const closeMediaStream = (stream: MediaStream | undefined) => {
  if (!stream) {
    return;
  }
  const tracks = stream.getTracks();
  tracks.forEach(track => track.stop());
};

// const colToRowTransform = (page:JSX.Element[],cols:number) => {

// };

export { closeMediaStream, getVideoTileLabel };
