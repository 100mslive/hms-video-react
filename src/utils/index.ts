// @ts-ignore
import { largestRect } from 'rect-scaler';
import { MediaStreamWithInfo } from '../types';

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

const colToRowTransform = (page: JSX.Element[], maxColCount: number) => {
  let cols = maxColCount;
  let rows = Math.ceil(page.length / cols);
  let remLastRowElem = page.length % cols;
  console.log(remLastRowElem, 'number to be skipped');
  let grid: JSX.Element[][] = [];
  let newArray: JSX.Element[] = [];

  let last = 0;
  for (let i = 0; i < cols && last < page.length; i++) {
    for (let j = 0; j < rows && last < page.length; j++) {
      if (j == rows - 1 && page.length % cols !== 0) {
        if (remLastRowElem == 0) {
          console.log('skipped', last, remLastRowElem);
          continue;
        }
        remLastRowElem--;
      }
      if (!grid[j]) grid[j] = [];
      console.log(last + 'inserted at ' + j, i);
      grid[j][i] = page[last];
      last++;
    }
  }
  last = 0;
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (grid[i] && grid[i][j]) newArray[last++] = grid[i][j];
  console.log(grid, cols, rows);
  return newArray;
};

const rowToColTransform = (page: JSX.Element[], maxRowCount: number) => {
  let rows = maxRowCount;
  let cols = Math.ceil(page.length / rows);
  let remLastColElem = page.length % rows;
  let grid: JSX.Element[][] = [];
  let newArray: JSX.Element[] = [];

  let last = 0;
  for (let i = 0; i < rows && last < page.length; i++) {
    for (let j = 0; j < cols && last < page.length; j++) {
      if (j == cols - 1 && page.length % rows !== 0) {
        if (remLastColElem == 0) {
          console.log('skipped', last, remLastColElem);
          continue;
        }
        remLastColElem--;
      }
      if (!grid[i]) grid[i] = [];
      console.log(last + 'inserted at ' + i, j);
      grid[i][j] = page[last];
      last++;
    }
  }
  last = 0;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      if (grid[j][i]) {
        newArray[last++] = grid[j][i];
      }

  console.log(grid);
  return newArray;
};

const groupTilesIntoPage = (
  tiles: JSX.Element[],
  chunkSize: number,
  onlyOnePage: boolean,
) => {
  return tiles.reduce(
    (resultArray: JSX.Element[][], tile: JSX.Element, index: number) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (chunkIndex > 0 && onlyOnePage) {
        return resultArray;
      }
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(tile);
      return resultArray;
    },
    [],
  );
};

export {
  closeMediaStream,
  getVideoTileLabel,
  colToRowTransform,
  rowToColTransform,
  groupTilesIntoPage,
};
