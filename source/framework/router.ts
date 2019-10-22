import { EventEmitter } from "./event_emitter";
import { APPEvent } from "./app_event";
import { Route } from "./route";

class Router extends EventEmitter implements IRouter {
    private _defaultController: string;
    private _defaultAction: string;

    constructor(mediator: IMediator, defaultController: string, defaultAction: string) {
        super(mediator);
        this._defaultController = defaultController || "home";
        this._defaultAction = defaultAction || "index";
    }

    public initialize() {
        $(window).on("hashchange", () => {
            var r = this.getRoute();
            this.onRouteChange(r);
        });

        this.subscribeToEvents([
            new APPEvent("app.initialize", null, (e: any, data?: any) => {
                this.onRouteChange(this.getRoute());
            }),
            new APPEvent("app.route", null, (e: any, data?: any) => {
                this.setRoute(data);
            }),
        ]);
    }

    private getRoute() {
        var h = window.location.hash;

        return this.parseRoute(h);
    }

    private setRoute(route: IRoute) {
        var s = route.serialize();
        window.location.hash = s;
    }

    private parseRoute(hash: string) {
        var comp, controller, action, args;
        if (hash[hash.length - 1] === "/") {
            hash = hash.substring(0, hash.length - 1);
        }
        comp = hash.replace("#", "").split("/");
        controller = comp[0] || this._defaultController;
        action = comp[1] || this._defaultAction;

        args = [];
        for (let i = 2; i < comp.length; i++) {
            args.push(comp[i]);           
        }

        return new Route(controller, action, args);
    }

    private onRouteChange(route: IRoute) {
        this.triggerEvent(new APPEvent("app.dispatch", route, null));
    }
}

export { Router };