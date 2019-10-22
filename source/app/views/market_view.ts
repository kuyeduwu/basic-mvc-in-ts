import { View, APPEvent, ViewSettings, Route } from "../../framework/framework";

@ViewSettings("./source/app/templates/market.hbs", "#outlet")
class MarketView extends View implements IView {
    constructor(mediator: IMediator) {
        super(mediator);
    }

    public initialize(): void {
        this.subscribeToEvents([
            new APPEvent("app.view.market.render", null, (e, args: any) => {
                this.renderAsync(args)
                    .then((model) => {
                        this.bindDomEvents(model);
                    })
                    .catch((e) => {
                        this.triggerEvent(new APPEvent("app.error", e, null));
                    });
            })
        ]);
    }

    public dispose(): void {
        this.unbindDomeEvents();
        this.unsubscribeToEvents();
    }

    protected bindDomEvents(model: any) {
        var scope = $(this._container);
        $(".getQuote").on("click", scope, (e) => {
            var symbol = $(e.currentTarget).data("symbol");
            this.getStockQuote(symbol);
        });
        $(scope).find("table").DataTable();
    }

    protected unbindDomeEvents() {
        var scope = this._container;
        $(".getQuote").off("click", scope);
        var table = $(scope).find("table").DataTable();
        table.destroy();
    }

    private getStockQuote(symbol: string) {
        this.triggerEvent(new APPEvent("app.route", new Route("symbol", "quote", [symbol]), null));
    }
}

export { MarketView };