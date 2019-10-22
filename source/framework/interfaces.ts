interface IAPPEvent {
    topic: string;
    data: any;
    handler: (e: any, data: any) => void;
}

interface IMediator {
    publish(e: IAPPEvent): void;
    subscribe(e: IAPPEvent): void;
    unsubscribe(e: IAPPEvent): void;
}

//Application
interface IAppSettings {
    isDebug: boolean;
    defaultController: string;
    defaultAction: string;
    controllers: Array<IControllerDetails>;
    onErrorHandler: (o: object) => void;
}

interface IControllerDetails {
    controllerName: string;
    controller: {new (...args: any[]): IController;}
}

interface IController extends IEventEmitter {
    initialize(): void;
    dispose(): void;
}

interface IRoute {
    controllerName: string;
    actionName: string;
    args: Object[];
    serialize(): string;
}

interface IEventEmitter {
    triggerEvent(event: IAPPEvent);
    subscribeToEvents(events: Array<IAPPEvent>);
    unsubscribeToEvents(events: Array<IAPPEvent>);
}

interface IRouter extends IEventEmitter {
    initialize(): void;
}

interface IDispatcher extends IEventEmitter {
    initialize(): void;
}

interface IModel extends IEventEmitter {
    initialize(): void;
    dispose(): void;
}

interface IView extends IEventEmitter {
    initialize(): void;
    dispose(): void;
}