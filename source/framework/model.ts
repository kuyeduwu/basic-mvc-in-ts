import { EventEmitter } from "./event_emitter";
import Q = require("q");
import $ = require("jquery");

function ModelSettings(serviceUrl: string) {
    return function<T extends {new(...args: any[]) : {}}>(target: T) {
        return class extends target {
            _serviceUrl = serviceUrl;
        }
    }
}

class Model extends EventEmitter implements IModel {
    private _serviceUrl: string;

    constructor(mediator: IMediator) {
        super(mediator);
    }

    public initialize() {
        throw new Error("Model.prototype.initialize() is abstract and must be implemented.");
    }

    public dispose() {
        throw new Error("Model.prototype.dispose() is abstract and must be implemented.");
    }

    protected requestAsync(method: string, dataType: string, data) {
        return Q.Promise((resolve: (r?) => void, reject: (e?) => void) => {
            $.ajax({
                method: method,
                url: this._serviceUrl,
                data: data || {},
                dataType: dataType,
                success: (response) => {
                    resolve(response);
                },
                error: (...args: any[]) => {
                    reject(args);
                }
            });
        });
    }

    protected getAsync(dataType: string, data: any) {
        return this.requestAsync("GET", dataType, data);
    }
    protected postAsync(dataType: string, data: any) {
        return this.requestAsync("POST", dataType, data);
    }
    protected putAsync(dataType: string, data: any) {
        return this.requestAsync("PUT", dataType, data);
    }
    protected deleteAsync(dataType: string, data: any) {
        return this.requestAsync("DELETE", dataType, data);
    }
}

export { Model, ModelSettings };