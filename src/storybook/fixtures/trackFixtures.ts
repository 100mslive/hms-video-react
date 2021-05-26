import { HMSTrack } from '../../store/schema';

let counter = 100;

export const makeFakeTrack = (): HMSTrack => {
  return {
    enabled: false,
    id: String(counter++),
    type: 'video',
  };
};
