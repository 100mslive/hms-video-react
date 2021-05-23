import {INotificationsManager, INotification} from '../IHMSNotification'

export class NotificationsManager extends EventTarget implements INotificationsManager {
    sendNotification(notification:INotification){
        const event = new CustomEvent('hms-bridge-notification',{detail:notification});
        this.dispatchEvent(event);
    }
    addNotificationListener(callback:(event:CustomEventInit) => void){
        this.addEventListener('hms-bridge-notification', callback);
    }
    //TODO should we remove event listeners on unload?
}