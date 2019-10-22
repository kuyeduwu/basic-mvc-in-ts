import { Model, APPEvent, ModelSettings } from "../../framework/framework";

@ModelSettings("http://dev.markitondemand.com/Api/v2/Quote/jsonp")
class QuoteModel extends Model implements IModel {
    constructor(mediator: IMediator) {
        super(mediator);
    }

    public initialize() {
        this.subscribeToEvents([
            new APPEvent("app.model.quote.change", null, (e, args) => {
                this.onChange(args);
            })
        ]);
    }

    public dispose() {
        this.unsubscribeToEvents();
    }

    private onChange(args): void {
        var s = { symbol: args };
        this.getAsync("jsonp", s)
            .then((data) => {
                var quote = this.formatModel(data);
                this.triggerEvent(new APPEvent("app.view.symbol.render", quote, null));
            })
            .catch((e) => {
                this.triggerEvent(new APPEvent("app.error", e, null));
            });
    }

    private formatModel(data) {
        data.Change = data.Change.toFixed(2);
        data.ChangePercent = data.ChangePercent.toFixed(2);
        data.Timestamp = new Date(data.Timestamp).toLocaleDateString();
        data.MarketCap = (data.MarketCap / 1000000).toFixed(2) + "M.";
        data.ChangePercentYTD = data.ChangePercentYTD.toFixed(2);
        return { quote: data};
    }
}

export { QuoteModel }