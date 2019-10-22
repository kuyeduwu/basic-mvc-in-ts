import { View, APPEvent, ViewSettings } from "../../framework/framework";

@ViewSettings(null, "#chart_container")
class ChartView extends View implements IView {
    constructor(mediator: IMediator) {
        super(mediator);
    }

    initialize(): void {
        this.subscribeToEvents([
            new APPEvent("app.view.chart.render", null, (e, model: any) => {
                this.renderChart(model);
                this.bindDomEvents(model);
            })
        ])
    }

    public dispose(): void {
        this.unbindDomeEvents();
        this.unsubscribeToEvents();
    }

    protected bindDomEvents(model: any) {
        var scope = $(this._container);
    }

    protected unbindDomeEvents() {
        var scope = this._container;
    }

    private renderChart(model) {
        $(this._container).highcharts({
          chart: {
            zoomType: 'x'
          },
          title: {
            text: model.title
          },
          subtitle: {
            text : 'Click and drag in the plot area to zoom in'
          },
          xAxis: {
            type: 'datetime'
          },
          yAxis: {
            title: {
              text: 'Price'
            }
          },
          legend: {
            enabled: true
          },
          tooltip: {
            shared: true,
            crosshairs: true
          },
          plotOptions: {
            area: {
              marker: {
                radius: 0
              },
              lineWidth: 0.1,
              threshold: null
            }
          },
          series: model.series
        });
      }
}

export { ChartView }