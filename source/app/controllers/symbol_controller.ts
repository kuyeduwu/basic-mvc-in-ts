import { Controller, APPEvent } from "../../framework/framework";
import { QuoteModel } from "../models/quote_model";
import { ChartModel } from "../models/chart_model";
import { ChartView } from "../views/chart_view";
import { SymbolView } from "../views/symbol_view";

class SymbolController extends Controller implements IController {
    private _quoteModel: IModel;
    private _chartModel: IModel;
    private _symbolView: IView;
    private _chartView: IView;

    constructor(mediator: IMediator) {
        super(mediator);
        this._quoteModel = new QuoteModel(mediator);
        this._chartModel = new ChartModel(mediator);
        this._chartView = new ChartView(mediator);
        this._symbolView = new SymbolView(mediator);
    }

    public initialize(): void {
        this.subscribeToEvents([
            new APPEvent("app.controller.symbol.quote", null, (e, symbol: string) => {
                this.quote(symbol);
            }),
        ]);

        this._quoteModel.initialize();
        this._chartModel.initialize();
        this._chartView.initialize();
        this._symbolView.initialize();
    }

    public dispose(): void {
        this.unsubscribeToEvents();

        this._quoteModel.dispose();
        this._chartModel.dispose();
        this._chartView.dispose();
        this._symbolView.dispose();
    }

    public quote(symbol: string) {
        this.triggerEvent(new APPEvent("app.model.quote.change", symbol, null));
    }
}

export { SymbolController };