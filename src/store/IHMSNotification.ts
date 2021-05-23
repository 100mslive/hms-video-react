import * as schema from './schema';

interface IHMSExceptionNotificationData {
    error: schema.HMSException | null;
}

interface IHMSPeerNotificationData {
    peer:schema.HMSPeer | null;
}

interface IHMSTrackNotificationData {
    track:schema.HMSTrack | null;
}

interface IHMSRoomNotificationData {
    room:schema.HMSRoom | null;
}

interface IHMSUpdateType {
    //TODO this can be named better. We have nested events and hence the need for 2 types 
    //Choosing to name 'type' for parent and 'updateType' for child. 
    //Ideally we should flatten the subTypes and allow user to subscribe to as granular an event as possible
    updateType:schema.HMSPeerUpdate | schema.HMSRoomUpdate | schema.HMSTrackUpdate;
} 

type IHMSNotificationData = IHMSRoomNotificationData | IHMSTrackNotificationData | IHMSPeerNotificationData | IHMSExceptionNotificationData | IHMSUpdateType;

type HMSNotificationType = 'join' | 'room-update' | 'peer-update' | 'track-update' | 'error';

export interface INotification {
    id: string;
    type:HMSNotificationType;
    data:IHMSNotificationData;
}

export interface INotificationsManager{
    sendNotification(notification:INotification): void;
    addNotificationListener(callback:(event:CustomEventInit) => void):void; 
}