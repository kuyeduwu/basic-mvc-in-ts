/// <reference path="interfaces.ts" />

class Mediator implements IMediator {
    private _$: JQuery;
    private _isDebug;

    constructor(isDebug: boolean = false) {
        this._$ = $("<p></p>");
        this._isDebug = isDebug;
    }

    public publish(e: IAPPEvent): void {
        if(this._isDebug === true) {
            console.log(new Date().getTime(), "PUBLISH", e.topic, e.data);
        }
        this._$.addClass("publish");
        this._$.trigger(e.topic, e.data);
    }

    public subscribe(e: IAPPEvent): void {
        if(this._isDebug === true) {
            console.log(new Date().getTime(), "SUBSCRIBE", e.topic, e.data);
        }
        this._$.addClass("subscribe");
        this._$.on(e.topic, e.handler);
    }

    public unsubscribe(e: IAPPEvent): void {
        if (this._isDebug === true) {
            console.log(new Date().getTime(), "UNSUBSCRIBE", e.topic, e.data);
        }
        this._$.addClass("unsubscribe");
        this._$.off(e.topic);
    }
}

export { Mediator };