import { APPEvent } from "./app_event";

class EventEmitter implements IEventEmitter {
    protected _mediator: IMediator;
    protected _events: Array<IAPPEvent>;

    constructor(mediator: IMediator) {
        this._mediator = mediator;
    }

    public triggerEvent(event: IAPPEvent) {
        this._mediator.publish(event);
    }

    public subscribeToEvents(events: Array<IAPPEvent>) {
        this._events = events;
        for (let i = 0; i < this._events.length; i++) {
            this._mediator.subscribe(this._events[i]);
        }
    }

    public unsubscribeToEvents() {
        for (let i = 0; i < this._events.length; i++) {
            this._mediator.unsubscribe(this._events[i]);           
        }
    }
}

export { EventEmitter };