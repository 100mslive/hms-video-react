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

const transposeMatrix = (
  matrix: JSX.Element[],
  rows: number,
  cols: number,
  isColTranspose: boolean,
): JSX.Element[] => {
  const newArr = [];
  while (matrix.length) newArr.push(matrix.splice(0, cols));
  // Object.keys(newArr[0]).map(function(c) {
  //   return matrix[i].map(function(r) {
  //     return r[c];
  //   });
  // });
  console.log(newArr, '2d array');

  return matrix;
};

export { closeMediaStream, getVideoTileLabel, transposeMatrix };
