import { TW, css } from 'twind/css';
//@ts-ignore
import { create } from 'twind';
import clsx from 'clsx';
import { reduce, merge } from 'lodash';
import { useHMSTheme } from '../hooks/HMSThemeProvider';
import { MediaStreamWithInfo } from '../types';
import {theme as defaultTheme} from '../defaultTheme'

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

  console.log('MEDIA STREAM ENDED ', stream);

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

const chunk = <T>(elements: T[], chunkSize: number, onlyOnePage: boolean) => {
  return elements.reduce((resultArray: T[][], tile: T, index: number) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (chunkIndex > 0 && onlyOnePage) {
      return resultArray;
    }
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(tile);
    return resultArray;
  }, []);
};

interface GetTileSizesInList {
  streams: MediaStreamWithInfo[];
  parentWidth: number;
  parentHeight: number;
  maxTileCount?: number;
  maxRowCount?: number;
  maxColCount?: number;
  aspectRatio?: {
    width: number;
    height: number;
  };
  onlyOnePage: boolean;
}

function chunkStreams({
  streams,
  parentWidth,
  parentHeight,
  maxTileCount,
  maxRowCount,
  maxColCount,
  aspectRatio,
  onlyOnePage,
}: GetTileSizesInList) {
  //TODO needs massive refactoring
  const modeAspectRatio = mode(
    streams
      .filter(
        stream =>
          stream.videoTrack &&
          stream.videoTrack.getSettings().width &&
          stream.videoTrack.getSettings().height,
      )
      .map(stream => {
        const width = stream.videoTrack?.getSettings().width;
        const height = stream.videoTrack?.getSettings().height;
        //Default to 1 if there are no video tracks
        return (width ? width : 1) / (height ? height : 1);
      }),
  );

  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  //Default to 1 if there are no video tracks
  const finalAspectRatio = aspectRatio
    ? aspectRatio
    : {
        width: !isNaN(modeAspectRatio) && modeAspectRatio ? modeAspectRatio : 1,
        height: 1,
      };
  if (maxTileCount) {
    const { width: initialWidth, height: initialHeight } = largestRect(
      parentWidth,
      parentHeight,
      Math.min(streams.length, maxTileCount),
      finalAspectRatio.width,
      finalAspectRatio.height,
    );
    defaultWidth = initialWidth;
    defaultHeight = initialHeight;
    tilesInFirstPage = Math.min(streams.length, maxTileCount);
    tilesinLastPage = streams.length % maxTileCount;
    isLastPageDifferentFromFirstPage =
      tilesinLastPage > 0 && streams.length > maxTileCount;
    if (isLastPageDifferentFromFirstPage) {
      const { width: remWidth, height: remHeight } = largestRect(
        parentWidth,
        parentHeight,
        tilesinLastPage,
        finalAspectRatio.width,
        finalAspectRatio.height,
      );
      lastPageWidth = remWidth;
      lastPageHeight = remHeight;
    }
  } else if (maxRowCount) {
    const rows = Math.min(
      Math.ceil(
        Math.sqrt(
          (streams.length *
            (finalAspectRatio.width / finalAspectRatio.height)) /
            (parentWidth / parentHeight),
        ),
      ),
      maxRowCount,
    );
    const height = parentHeight / rows;
    const width = height * (finalAspectRatio.width / finalAspectRatio.height);
    const cols = Math.floor(parentWidth / width);
    defaultWidth = width;
    defaultHeight = height;
    tilesInFirstPage = Math.min(streams.length, rows * cols);
    tilesinLastPage = streams.length % (rows * cols);
    isLastPageDifferentFromFirstPage =
      tilesinLastPage > 0 && streams.length > rows * cols;
    if (isLastPageDifferentFromFirstPage) {
      const rows = Math.min(
        Math.ceil(
          Math.sqrt(
            (tilesinLastPage *
              (finalAspectRatio.width / finalAspectRatio.height)) /
              (parentWidth / parentHeight),
          ),
        ),
        maxRowCount,
      );
      const height = parentHeight / rows;
      const width = height * (finalAspectRatio.width / finalAspectRatio.height);
      lastPageHeight = height;
      lastPageWidth = width;
    }
  } else if (maxColCount) {
    const cols = Math.min(
      Math.ceil(
        Math.sqrt(
          (streams.length * (parentWidth / parentHeight)) /
            (finalAspectRatio.width / finalAspectRatio.height),
        ),
      ),
      maxColCount,
    );
    const width = parentWidth / cols;
    const height = width / (finalAspectRatio.width / finalAspectRatio.height);
    const rows = Math.floor(parentHeight / height);
    defaultHeight = height;
    defaultWidth = width;
    tilesInFirstPage = Math.min(streams.length, rows * cols);
    tilesinLastPage = streams.length % (rows * cols);
    isLastPageDifferentFromFirstPage =
      tilesinLastPage > 0 && streams.length > rows * cols;
    if (isLastPageDifferentFromFirstPage) {
      const cols = Math.min(
        Math.ceil(
          Math.sqrt(
            (tilesinLastPage * (parentWidth / parentHeight)) /
              (finalAspectRatio.width / finalAspectRatio.height),
          ),
        ),
        maxColCount,
      );
      const width = parentWidth / cols;
      const height = width / (finalAspectRatio.width / finalAspectRatio.height);
      lastPageHeight = height;
      lastPageWidth = width;
    }
  } else {
    const { width, height } = largestRect(
      parentWidth,
      parentHeight,
      streams.length,
      finalAspectRatio.width,
      finalAspectRatio.height,
    );
    defaultWidth = width;
    defaultHeight = height;
    tilesInFirstPage = streams.length;
  }
  const chunks = chunk(streams, tilesInFirstPage, onlyOnePage);
  return chunks.map((chunk, page) => {
    return chunk.map(stream => {
      const isLastPage = page === chunks.length - 1;
      const width =
        isLastPageDifferentFromFirstPage && isLastPage
          ? lastPageWidth
          : defaultWidth;
      const height =
        isLastPageDifferentFromFirstPage && isLastPage
          ? lastPageHeight
          : defaultHeight;
      return { ...stream, width, height };
    });
  });
}

function mode(array: any[]) {
  if (array.length === 0) {
    return null;
  }
  var modeMap = {} as any;
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] === null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;
    }
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

const getInitialsFromName = (name: string | undefined) => {
  console.debug('HMSui-component: Getting initials of', name);
  if (!name) {
    return undefined;
  } else {
    return name
      .match(/(^\S\S?|\b\S)?/g)
      ?.join('')
      ?.match(/(^\S|\S$)?/g)
      ?.join('')
      .toUpperCase();
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
  const aspectRatio = width && height && width / height;
  if (aspectRatio !== undefined && isNaN(aspectRatio)) {
    throw new Error('Aspect ratio must be a number');
  }

  let best = { area: 0, cols: 0, rows: 0, width: 0, height: 0 };

  // TODO: Don't start with obviously-`ba`d candidates.
  const startCols = numRects;
  const colDelta = -1;

  // For each combination of rows + cols that can fit the number of rectangles,
  // place them and see the area.
  if (aspectRatio !== undefined) {
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
  console.debug(
    'HMSui-components: [getTileContainerDimensions] all data',
    videoTrack,
    objectFit,
    aspectRatio,
    parentWidth,
    parentHeight,
  );
  const { width: selfWidth, height: selfHeight } = videoTrack
    ? videoTrack.getSettings()
    : { width: parentWidth, height: parentHeight };
  console.debug(
    'HMSui-components: [getTileContainerDimensions] selfHeight, selfWidth',
    selfHeight,
    selfWidth,
  );
  const containerAspectRatio =
    objectFit === 'cover'
      ? { width: parentWidth, height: parentHeight }
      : { width: selfWidth, height: selfHeight };
  console.debug(
    'HMSui-components: [getTileContainerDimensions] containerAspectRatio',
    containerAspectRatio,
  );
  const containerAspectRatioAfterUserOverride =
    aspectRatio && objectFit === 'cover' ? aspectRatio : containerAspectRatio;
  console.debug(
    'HMSui-components: [getTileContainerDimensions] containerAspectRatioAfterUserOverride',
    containerAspectRatioAfterUserOverride,
  );
  const containerAspectRatioAfterShapeOverride = {
    width: isSquareOrCircle ? 1 : containerAspectRatioAfterUserOverride.width,
    height: isSquareOrCircle ? 1 : containerAspectRatioAfterUserOverride.height,
  };
  console.debug(
    'HMSui-components: [getTileContainerDimensions] containerAspectRatioAfterShapeOverride',
    containerAspectRatioAfterShapeOverride,
  );
  const { width, height } =
    containerAspectRatioAfterShapeOverride.width &&
    containerAspectRatioAfterShapeOverride.height
      ? largestRect(
          parentWidth,
          parentHeight,
          1,
          containerAspectRatioAfterShapeOverride.width,
          containerAspectRatioAfterShapeOverride.height,
        )
      : { width: parentWidth, height: parentHeight };
  console.debug(
    'HMSui-components: [getTileContainerDimensions] width, height',
    width,
    height,
  );
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
}

function addGlobalCss<Type>({
  seedStyleMap,
  componentName,
}: AddGlobalCssProps<Type>) {
  let theme = defaultTheme();
  // alert(JSON.stringify(theme));
  try {
    let context = useHMSTheme();
    theme = context.theme;
  } catch (error) {}

  let tw_merged = create({ theme }).tw;
  let calculatedSeedStyleMap: Type | {} = {};
  for (const seed in seedStyleMap as Type) {
    //TODO define a generic Map TS type to define classes to remove all type related ignores
    //@ts-ignore
    const styles = seedStyleMap[seed] as string;
    const className = generateClassName({ seed, componentName });
    //TODO add this to a private stylesheet and add a check to not write this if it already exists
    tw_merged(
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
  getInitialsFromName,
  largestRect,
  getTileContainerDimensions,
  generateClassName,
  addGlobalCss,
  combineClasses,
  chunkStreams,
  mode,
};
