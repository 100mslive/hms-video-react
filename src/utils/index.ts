import { TW, css } from 'twind/css';
import clsx from 'clsx';
import { reduce, merge } from 'lodash';

const getVideoTileLabel = (
  peerName: string,
  isLocal: boolean,
  videoSource: 'screen' | 'camera' | 'canvas' | undefined,
) => {
  // Map [isLocal, videoSource] to the label to be displayed.
  const labelMap = new Map<string, string>([
    [[true, 'screen'].toString(), 'Your Screen'],
    [[true, 'camera'].toString(), 'You'],
    [[false, 'screen'].toString(), `${peerName}'s Screen`],
    [[false, 'camera'].toString(), peerName],
    [[false, undefined].toString(), peerName],
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
  //console.log(remLastRowElem, 'number to be skipped');
  let grid: JSX.Element[][] = [];
  let newArray: JSX.Element[] = [];

  let last = 0;
  for (let i = 0; i < cols && last < page.length; i++) {
    for (let j = 0; j < rows && last < page.length; j++) {
      if (j === rows - 1 && page.length % cols !== 0) {
        if (remLastRowElem === 0) {
          //console.log('skipped', last, remLastRowElem);
          continue;
        }
        remLastRowElem--;
      }
      if (!grid[j]) {
        grid[j] = [];
      }
      //console.log(`${last}inserted at ${j}`, i);
      grid[j][i] = page[last];
      last++;
    }
  }
  last = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i] && grid[i][j]) {
        newArray[last++] = grid[i][j];
      }
    }
  }
  //console.log(grid, cols, rows);
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
      if (j === cols - 1 && page.length % rows !== 0) {
        if (remLastColElem === 0) {
          //console.log('skipped', last, remLastColElem);
          continue;
        }
        remLastColElem--;
      }
      if (!grid[i]) {
        grid[i] = [];
      }
      //console.log(`${last}inserted at ${i}`, j);
      grid[i][j] = page[last];
      last++;
    }
  }
  last = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[j][i]) {
        newArray[last++] = grid[j][i];
      }
    }
  }

  //console.log(grid);
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

const getInitialsFromName = (name: string | undefined) => {
  console.debug('HMSui-component: Getting initials of', name);
  if (!name) {
    return undefined;
  } else {
    const rgx = /(\p{L}{1})\p{L}+/gu;
    console.debug('HMSui-component: rgx is', rgx, name);
    let initialsArray = name.match(rgx) || [];
    console.debug('HMSui-component: Initial initials are', initialsArray);
    let initials = (
      (initialsArray[0] ? initialsArray.shift()![0] : '') +
      (initialsArray[0] ? initialsArray.pop()![0] : '')
    ).toUpperCase();
    console.debug('HMSui-component: Initials are', initials);
    return initials;
  }
};

/**
 * Finds the largest rectangle area when trying to place N rectangle into a containing
 * rectangle without rotation.
 *
 * @param {Number}  containerWidth      The width of the container.
 * @param {Number}  containerHeight     The height of the container.
 * @param {Number}  numSquares          How many rectangles must fit within.
 * @param {Number}  width               The unscaled width of the rectangles to be placed.
 * @param {Number}  height              The unscaled height of the rectangles to be placed.
 * @return {Object}                     The area and number of rows and columns that fit.
 */
const largestRect = (
  containerWidth: number,
  containerHeight: number,
  numRects: number,
  width: number | undefined,
  height: number | undefined,
) => {
  if (containerWidth < 0 || containerHeight < 0) {
    throw new Error('Container must have a non-negative area');
  }
  if (numRects < 1 || !Number.isInteger(numRects)) {
    throw new Error('Number of shapes to place must be a positive integer');
  }
  const aspectRatio = width && height && (width / height || 1);
  if (!aspectRatio || isNaN(aspectRatio)) {
    throw new Error('Aspect ratio must be a number');
  }

  let best = { area: 0, cols: 0, rows: 0, width: 0, height: 0 };

  // TODO: Don't start with obviously-`ba`d candidates.
  const startCols = numRects;
  const colDelta = -1;

  // For each combination of rows + cols that can fit the number of rectangles,
  // place them and see the area.
  for (let cols = startCols; cols > 0; cols += colDelta) {
    const rows = Math.ceil(numRects / cols);
    const hScale = containerWidth / (cols * aspectRatio);
    const vScale = containerHeight / rows;
    let width;
    let height;
    // Determine which axis is the constraint.
    if (hScale <= vScale) {
      width = containerWidth / cols;
      height = width / aspectRatio;
    } else {
      height = containerHeight / rows;
      width = height * aspectRatio;
    }
    const area = width * height;
    if (area > best.area) {
      best = { area, width, height, rows, cols };
    }
  }
  return best;
};

export interface getTileContainerDimensionsProps {
  videoTrack: MediaStreamTrack;
  parentWidth: number;
  parentHeight: number;
  objectFit?: 'contain' | 'cover';
  aspectRatio?: {
    width: number;
    height: number;
  };
  isSquareOrCircle?: boolean;
}

const getTileContainerDimensions = ({
  videoTrack,
  objectFit,
  aspectRatio,
  parentWidth,
  parentHeight,
  isSquareOrCircle,
}: getTileContainerDimensionsProps) => {
  //console.log(stream, objectFit, aspectRatio, parentWidth, parentHeight);
  const { width: selfWidth, height: selfHeight } = videoTrack
    ? videoTrack.getSettings()
    : { width: parentWidth, height: parentHeight };
  //console.log(selfHeight, selfWidth);
  const containerAspectRatio =
    objectFit === 'cover'
      ? { width: parentWidth, height: parentHeight }
      : { width: selfWidth, height: selfHeight };
  //console.log(containerAspectRatio);
  const containerAspectRatioAfterUserOverride =
    aspectRatio && objectFit === 'cover' ? aspectRatio : containerAspectRatio;
  //console.log(containerAspectRatioAfterUserOverride);
  const containerAspectRatioAfterShapeOverride = {
    width: isSquareOrCircle ? 1 : containerAspectRatioAfterUserOverride.width,
    height: isSquareOrCircle ? 1 : containerAspectRatioAfterUserOverride.height,
  };
  //console.log(containerAspectRatioAfterShapeOverride);
  const { width, height } = largestRect(
    parentWidth,
    parentHeight,
    1,
    containerAspectRatioAfterShapeOverride.width,
    containerAspectRatioAfterShapeOverride.height,
  );
  //console.log(width, height);
  return { width, height };
};

interface GenerateClassNameProps {
  seed: string;
  componentName: string;
}

const packageIdentifier = 'hmsui';

const generateClassName = ({ seed, componentName }: GenerateClassNameProps) => {
  return [packageIdentifier, componentName, seed].join('-');
};

interface AddGlobalCssProps<Type> {
  seedStyleMap: Type;
  componentName: string;
  tw: TW;
}

function addGlobalCss<Type>({
  seedStyleMap,
  componentName,
  tw,
}: AddGlobalCssProps<Type>) {
  let calculatedSeedStyleMap: Type | {} = {};
  for (const seed in seedStyleMap as Type) {
    //TODO define a generic Map TS type to define classes to remove all type related ignores
    //@ts-ignore
    const styles = seedStyleMap[seed] as string;
    const className = generateClassName({ seed, componentName });
    //TODO add this to a private stylesheet and add a check to not write this if it already exists
    tw(
      css`
        @global {
          .${className} {
            @apply ${styles};
          }
        }
      `,
    );
    //@ts-ignore
    calculatedSeedStyleMap[seed] = className;
  }
  return calculatedSeedStyleMap;
}

function combineClasses(
  defaultClasses: Record<string, string | undefined> | undefined,
  extraClasses: Record<string, string | undefined> | undefined,
) {
  return extraClasses
    ? reduce(
        defaultClasses,
        (combinedClasses, defaultClassName, seed) => {
          combinedClasses![seed] = clsx(defaultClassName, extraClasses![seed]);
          return combinedClasses;
        },
        {} as Record<string, string>,
      )
    : defaultClasses;
}

export {
  closeMediaStream,
  getVideoTileLabel,
  colToRowTransform,
  rowToColTransform,
  groupTilesIntoPage,
  getInitialsFromName,
  largestRect,
  getTileContainerDimensions,
  generateClassName,
  addGlobalCss,
  combineClasses,
};
