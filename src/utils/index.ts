import { css } from 'twind/css';
//@ts-ignore
import { create } from 'twind';
import clsx from 'clsx';
import reduce from 'lodash/reduce';
import { HMSTrackSource } from '@100mslive/hms-video-store';
import { parsedUserAgent } from '@100mslive/hms-video';
import { useHMSTheme } from '../hooks/HMSThemeProvider';
import { theme as defaultTailwindConfig } from '../defaultTheme';
import { TrackWithPeer } from './videoListUtils';

const getVideoTileLabel = (
  peerName: string,
  isLocal: boolean,
  videoSource: HMSTrackSource = 'regular',
  isLocallyMuted: boolean | undefined,
) => {
  // Map [isLocal, videoSource] to the label to be displayed.
  const labelMap = new Map<string, string>([
    [[true, 'screen'].toString(), 'Your Screen'],
    [[true, 'regular'].toString(), `You (${peerName})`],
    [[false, 'screen'].toString(), `${peerName}'s Screen`],
    [[false, 'regular'].toString(), peerName],
    [[false, undefined].toString(), peerName],
  ]);

  let label = labelMap.get([isLocal, videoSource].toString());
  if (isLocallyMuted === undefined || isLocallyMuted === null) {
    return label;
  }
  return `${label}${isLocallyMuted ? ' (Muted for you)' : ''}`;
};

const closeMediaStream = (stream: MediaStream | undefined) => {
  if (!stream) {
    return;
  }
  if (
    MediaStreamTrack &&
    MediaStreamTrack.prototype &&
    // @ts-ignore
    MediaStreamTrack.prototype.stop
  ) {
    var tracks, i, len;

    if (stream.getTracks) {
      tracks = stream.getTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    } else {
      tracks = stream.getAudioTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }

      tracks = stream.getVideoTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    }
    // Deprecated by the spec, but still in use.
    // @ts-ignore
  } else if (typeof stream.stop === 'function') {
    console.log('closeMediaStream() | calling stop() on the MediaStream');
    // @ts-ignore
    stream.stop();
  }
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
  count: number;
  parentWidth: number;
  parentHeight: number;
  maxTileCount?: number;
  maxRowCount?: number;
  maxColCount?: number;
  aspectRatio: {
    width: number;
    height: number;
  };
}

/**
 * get the aspect ration occurring with the highest frequency
 * @param tracks - video tracks to infer aspect ratios from
 */
const getModeAspectRatio = (tracks: TrackWithPeer[]): number | null => {
  return mode(
    tracks
      .filter(track => track.track?.width && track.track?.height)
      .map(track => {
        const width = track.track?.width;
        const height = track.track?.height;
        //Default to 1 if there are no video tracks
        return (width ? width : 1) / (height ? height : 1);
      }),
  );
};

interface GetTileSizes {
  parentWidth: number;
  parentHeight: number;
  count: number;
  maxCount: number;
  aspectRatio: { width: number; height: number };
}

const getTileSizesWithPageConstraint = ({
  parentWidth,
  parentHeight,
  count,
  maxCount,
  aspectRatio,
}: GetTileSizes) => {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  const { width: initialWidth, height: initialHeight } = largestRect(
    parentWidth,
    parentHeight,
    Math.min(count, maxCount),
    aspectRatio.width,
    aspectRatio.height,
  );
  defaultWidth = initialWidth;
  defaultHeight = initialHeight;
  tilesInFirstPage = Math.min(count, maxCount);
  tilesinLastPage = count % maxCount;
  isLastPageDifferentFromFirstPage = tilesinLastPage > 0 && count > maxCount;
  if (isLastPageDifferentFromFirstPage) {
    const { width: remWidth, height: remHeight } = largestRect(
      parentWidth,
      parentHeight,
      tilesinLastPage,
      aspectRatio.width,
      aspectRatio.height,
    );
    lastPageWidth = remWidth;
    lastPageHeight = remHeight;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  };
};

const getTileSizesWithRowConstraint = ({
  parentWidth,
  parentHeight,
  count,
  maxCount,
  aspectRatio,
}: GetTileSizes) => {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  const rows = Math.min(
    Math.ceil(
      Math.sqrt(
        (count * (aspectRatio.width / aspectRatio.height)) /
          (parentWidth / parentHeight),
      ),
    ),
    maxCount,
  );
  const height = parentHeight / rows;
  const width = height * (aspectRatio.width / aspectRatio.height);
  const cols = Math.floor(parentWidth / width);
  defaultWidth = width;
  defaultHeight = height;
  tilesInFirstPage = Math.min(count, rows * cols);
  tilesinLastPage = count % (rows * cols);
  isLastPageDifferentFromFirstPage = tilesinLastPage > 0 && count > rows * cols;
  if (isLastPageDifferentFromFirstPage) {
    const rows = Math.min(
      Math.ceil(
        Math.sqrt(
          (tilesinLastPage * (aspectRatio.width / aspectRatio.height)) /
            (parentWidth / parentHeight),
        ),
      ),
      maxCount,
    );
    const height = parentHeight / rows;
    const width = height * (aspectRatio.width / aspectRatio.height);
    lastPageHeight = height;
    lastPageWidth = width;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  };
};

const getTileSizesWithColConstraint = ({
  parentWidth,
  parentHeight,
  count,
  maxCount,
  aspectRatio,
}: GetTileSizes) => {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;
  let tilesinLastPage = 0;
  const cols = Math.min(
    Math.ceil(
      Math.sqrt(
        (count * (parentWidth / parentHeight)) /
          (aspectRatio.width / aspectRatio.height),
      ),
    ),
    maxCount,
  );
  const width = parentWidth / cols;
  const height = width / (aspectRatio.width / aspectRatio.height);
  const rows = Math.floor(parentHeight / height);
  defaultHeight = height;
  defaultWidth = width;
  tilesInFirstPage = Math.min(count, rows * cols);
  tilesinLastPage = count % (rows * cols);
  isLastPageDifferentFromFirstPage = tilesinLastPage > 0 && count > rows * cols;
  if (isLastPageDifferentFromFirstPage) {
    const cols = Math.min(
      Math.ceil(
        Math.sqrt(
          (tilesinLastPage * (parentWidth / parentHeight)) /
            (aspectRatio.width / aspectRatio.height),
        ),
      ),
      maxCount,
    );
    const width = parentWidth / cols;
    const height = width / (aspectRatio.width / aspectRatio.height);
    lastPageHeight = height;
    lastPageWidth = width;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  };
};

function calculateLayoutSizes({
  count,
  parentWidth,
  parentHeight,
  maxTileCount,
  maxRowCount,
  maxColCount,
  aspectRatio,
}: GetTileSizesInList) {
  let defaultWidth = 0;
  let defaultHeight = 0;
  let lastPageWidth = 0;
  let lastPageHeight = 0;
  let isLastPageDifferentFromFirstPage = false;
  let tilesInFirstPage = 0;

  if (count == 0) {
    // no tracks to show
    return {
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    };
  }

  if (maxTileCount) {
    ({
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    } = getTileSizesWithPageConstraint({
      parentWidth,
      parentHeight,
      count,
      maxCount: maxTileCount,
      aspectRatio,
    }));
  } else if (maxRowCount) {
    ({
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    } = getTileSizesWithRowConstraint({
      parentWidth,
      parentHeight,
      count,
      maxCount: maxRowCount,
      aspectRatio,
    }));
  } else if (maxColCount) {
    ({
      tilesInFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
      isLastPageDifferentFromFirstPage,
    } = getTileSizesWithColConstraint({
      parentWidth,
      parentHeight,
      count,
      maxCount: maxColCount,
      aspectRatio,
    }));
  } else {
    const { width, height } = largestRect(
      parentWidth,
      parentHeight,
      count,
      aspectRatio.width,
      aspectRatio.height,
    );
    defaultWidth = width;
    defaultHeight = height;
    tilesInFirstPage = count;
  }
  return {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  };
}

interface ChunkElements<T> {
  elements: T[];
  tilesInFirstPage: number;
  onlyOnePage: boolean;
  isLastPageDifferentFromFirstPage: boolean;
  defaultWidth: number;
  defaultHeight: number;
  lastPageWidth: number;
  lastPageHeight: number;
}

/**
 * Given a list of tracks/elements and some constraints, group the tracks in separate pages.
 * @return 2D list for every page which has the original element and height and width
 * for its tile.
 */
const chunkElements = <T>({
  elements,
  tilesInFirstPage,
  onlyOnePage,
  isLastPageDifferentFromFirstPage,
  defaultWidth,
  defaultHeight,
  lastPageWidth,
  lastPageHeight,
}: ChunkElements<T>): (T & { width: number; height: number })[][] => {
  const chunks: T[][] = chunk<T>(elements, tilesInFirstPage, onlyOnePage);
  return chunks.map((chunk, page) => {
    return chunk.map(element => {
      const isLastPage = page === chunks.length - 1;
      const width =
        isLastPageDifferentFromFirstPage && isLastPage
          ? lastPageWidth
          : defaultWidth;
      const height =
        isLastPageDifferentFromFirstPage && isLastPage
          ? lastPageHeight
          : defaultHeight;
      return { ...element, height, width };
    });
  });
};

/**
 * Mathematical mode - the element with the highest occurrence in an array
 * @param array
 */
function mode(array: number[]): number | null {
  if (array.length === 0) {
    return null;
  }
  const modeMap: Record<number, number> = {};
  let maxEl = array[0];
  let maxCount = 1;
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
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
 * @param {Number}  numRects            How many rectangles must fit within.
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
  let tailwindConfig = defaultTailwindConfig;
  // alert(JSON.stringify(theme));
  try {
    let context = useHMSTheme();
    tailwindConfig = context.tailwindConfig;
  } catch (error) {}

  let tw_merged = create({
    ...tailwindConfig,
    darkMode: 'class',
    mode: 'silent',
  }).tw;
  let calculatedSeedStyleMap: Type | {} = {};
  for (const seed in seedStyleMap as Type) {
    //TODO define a generic Map TS type to define classes to remove all type related ignores
    //@ts-expect-error
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
    //@ts-expect-error
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

const generateRandomString = () =>
  Math.random()
    .toString(36)
    .substring(7);

const mergeRefs = (
  ...refs: (React.MutableRefObject<any> | ((node?: Element | null) => void))[]
) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) {
    return null;
  }
  if (filteredRefs.length === 0) {
    return filteredRefs[0];
  }
  return (inst: Element | null) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

const scrollTo = (element: React.MutableRefObject<any>) => () => {
  element.current.scrollIntoView();
};

const sigmoid = (z: number) => {
  return 1 / (1 + Math.exp(-z));
};

function isMobileDevice() {
  const device = parsedUserAgent.getDevice();
  return device && device.type === 'mobile';
}

export {
  closeMediaStream,
  getVideoTileLabel,
  getInitialsFromName,
  largestRect,
  generateClassName,
  addGlobalCss,
  combineClasses,
  chunkElements,
  mode,
  generateRandomString,
  mergeRefs,
  scrollTo,
  getModeAspectRatio,
  calculateLayoutSizes,
  sigmoid,
  isMobileDevice,
};
