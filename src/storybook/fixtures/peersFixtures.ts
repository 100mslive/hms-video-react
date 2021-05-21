import { HMSPeerWithMuteStatus } from '../../store/selectors';
import { HMSPeer } from '../../store/schema';

let counter = 1;
export const makeFakeParticipant = (name: string, role='Student') => {
  return {
    peer: { id: String(counter++), name, role: role } as HMSPeer,
    isAudioMuted: false,
  } as HMSPeerWithMuteStatus;
}

export const fakeParticipants = [
  makeFakeParticipant('Alex Tinmayson', 'Teacher'),
  makeFakeParticipant('Ankita Bhattacharya'),
  makeFakeParticipant('Anshul Kumar'),
  makeFakeParticipant('Ishaan Awasthi'),
  makeFakeParticipant('Ivy Loppinbug', 'Teacher'),
  makeFakeParticipant('Sudhanshu Kumar'),
]
