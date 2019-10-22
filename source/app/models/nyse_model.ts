import { Model, APPEvent, ModelSettings } from "../../framework/framework";

@ModelSettings("./data/nyse.json")
class NyseModel extends Model implements IModel {
    constructor(mediator: IMediator) {
        super(mediator);
    }

    public initialize() {
        this.subscribeToEvents([
            new APPEvent("app.model.nyse.change", null, (e, args) => {
                this.onChange(args);
            })
        ]);
    }

    public dispose() {
        this.unsubscribeToEvents();
    }

    private onChange(args): void {
        this.getAsync("json", args)
            .then((data) => {
                var stocks = {items: data, market: "NYSE"};
                this.triggerEvent(new APPEvent("app.view.market.render", stocks, null));
            })
            .catch((e) => {
                this.triggerEvent(new APPEvent("app.error", e, null));
            });
    }
}

export { NyseModel };