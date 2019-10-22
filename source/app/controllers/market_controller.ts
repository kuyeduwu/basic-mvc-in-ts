import { Controller, APPEvent } from "../../framework/framework";
import { MarketView } from "../views/market_view";
import { NasdaqModel } from "../models/nasdaq_model";
import { NyseModel } from "../models/nyse_model";

class MarketController extends Controller implements IController {
    private _marketView: IView;
    private _nasdaqModel: IModel;
    private _nyseModel: IModel;

    constructor(mediator: IMediator) {
        super(mediator);
        this._marketView = new MarketView(mediator);
        this._nasdaqModel = new NasdaqModel(mediator);
        this._nyseModel = new NyseModel(mediator);
    }

    public initialize(): void {
        this.subscribeToEvents([
            new APPEvent("app.controller.market.nasdaq", null, (e, args: string[]) => {
                this.nasdaq(args);
            }),
            new APPEvent("app.controller.market.nyse", null, (e, args: string[]) => {
                this.nyse(args);
            })
        ]);

        this._marketView.initialize();
        this._nasdaqModel.initialize();
        this._nyseModel.initialize();
    }

    public dispose(): void {
        this.unsubscribeToEvents();

        this._marketView.dispose();
        this._nasdaqModel.dispose();
        this._nyseModel.dispose();
    }

    public nasdaq(args: string[]) {
        this._mediator.publish(new APPEvent("app.model.nasdaq.change", null, null));
    }

    public nyse(args: string[]) {
        this._mediator.publish(new APPEvent("app.model.nyse.change", null, null));
    }
}

export { MarketController };