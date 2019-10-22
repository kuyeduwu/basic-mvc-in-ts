import { EventEmitter } from "./event_emitter";
import {  } from "handlebars"
import Q = require("q")

// function ViewSettings(templateUrl: string, container: string) {
//     return function(target: any) {
//         var original = target;

//         function construct(constructor, args) {
//             var c: any = function() {
//                 return constructor.apply(this, args);
//             }
//             c.prototype = constructor.prototype;
//             var instance = new c();
//             instance._container = container;
//             instance._templateUrl = templateUrl;
//             return instance;
//         }

//         var f: any = function(...args) {
//             return construct(original, args);
//         }

//         f.prototype = original.prototype;

//         return f;
//     }
// }

function ViewSettings(templateUrl: string, container: string) {
    return function<T extends {new (...args: any[]) : {}}>(target: T) {
        return class extends target {
            _container = container;
            _templateUrl = templateUrl;
        }
    }
}

class View extends EventEmitter implements IView {
    protected _container: string;
    private _templateUrl: string;

    private _templateDelegate: HandlebarsTemplateDelegate;

    constructor(mediator: IMediator) {
        super(mediator);
    }

    public initialize() {
        throw new Error("View.prototype.initialize() is abstract and must be implemented.");
    }

    public dispose() {
        throw new Error("View.prototype.initialize() is abstract and must be implemented.");
    }

    protected bindDomEvents(model: any) {
        throw new Error("View.prototype.bindDomEvents() is abstract and must be implemented.");
    }

    protected unbindDomeEvents() {
        throw new Error("View.prototype.unbindDomeEvents() is abstract and must be implemented.");
    }

    private loadTemplateAsync() {
        return Q.Promise((resolve: (r?) => void, reject: (e?) => void) => {
            $.ajax({
                method: "GET",
                url: this._templateUrl,
                dataType: "text",
                success: (response) => {
                    resolve(response);
                },
                error: (...args: any[]) => {
                    reject(args);
                }
            });
        });
    }

    private compileTemplateAsync(source: string) {
        return Q.Promise((resolve: (r?) => void, reject: (e?) => void) => {
            try {
                var template = Handlebars.compile(source);
                resolve(template);
            } catch (e) {
                reject(e);
            }
        });
    }

    private getTemplateAsync() {
        return Q.Promise((resolve: (r?) => void, reject: (e?) => void) => {
            if(this._templateDelegate === undefined || this._templateDelegate === null) {
                this.loadTemplateAsync()
                    .then((source) => {
                        return this.compileTemplateAsync(source);
                    })
                    .then((templateDelegate) => {
                        this._templateDelegate = templateDelegate;
                        resolve(this._templateDelegate);
                    })
                    .catch((e) => {
                        reject(e);
                    })
            } else {
                resolve(this._templateDelegate);
            }
        });
    }

    protected renderAsync(model) {
        return Q.Promise((resolve: (r?) => void, reject: (e?) => void) => {
            this.getTemplateAsync()
                .then((templateDelegate) => {
                    var html = this._templateDelegate(model);
                    $(this._container).html(html);

                    resolve(model);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}

export { View, ViewSettings };