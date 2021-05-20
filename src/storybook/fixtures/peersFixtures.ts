
let counter = 1;
export const makeFakeParticipant = (name: string, role='Student') => {
  return {
    peer: { id: String(counter++), displayName: name, role: role },
    isAudioMuted: false,
    isStarMarked: false,
  }
}

export const fakeParticipants = [
  makeFakeParticipant('Alex Tinmayson', 'Teacher'),
  makeFakeParticipant('Ankita Bhattacharya'),
  makeFakeParticipant('Anshul Kumar'),
  makeFakeParticipant('Ishaan Awasthi'),
  makeFakeParticipant('Ivy Loppinbug', 'Teacher'),
  makeFakeParticipant('Sudhanshu Kumar'),
]
