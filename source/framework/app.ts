/// <reference path="interfaces.ts" />

import { Dispatcher } from "./dispatcher";
import { Mediator } from "./mediator";
import { APPEvent } from "./app_event";
import { Router } from "./router";

class App {
    private _dispatcher: IDispatcher;
    private _mediator: IMediator;
    private _router: IRouter;
    private _controllers: IControllerDetails[];
    private _onErrorHandler: (o: object) => void;

    constructor(appSettings: IAppSettings) {
        this._controllers = appSettings.controllers;
        this._mediator = new Mediator(appSettings.isDebug || false);
        this._router = new Router(this._mediator, appSettings.defaultController, appSettings.defaultAction);
        this._dispatcher = new Dispatcher(this._mediator, this._controllers);
        this._onErrorHandler = appSettings.onErrorHandler;
    }

    public initialize() {
        this._router.initialize();
        this._dispatcher.initialize();
        this._mediator.subscribe(new APPEvent("app.error", null, (e: any, data?: any) => {
            this._onErrorHandler(data);
        }));
        this._mediator.publish(new APPEvent("app.initialize", null, null));
    }
}

export { App };