export class SummaryPanel extends window.Autodesk.Viewing.UI.PropertyPanel {
  constructor(extension: any, id: any, title: any) {
    super(extension.viewer.container, id, title);
    this.extension = extension;
  }

  async update(model: any, dbids: any, propNames: any) {
    this.removeAllProperties();
    for (const propName of propNames) {
      const initialValue = { sum: 0, count: 0, min: Infinity, max: -Infinity };
      const aggregateFunc = (aggregate: any, value: any, property: any) => {
        return {
          count: aggregate.count + 1,
          sum: aggregate.sum + value,
          min: Math.min(aggregate.min, value),
          max: Math.max(aggregate.max, value),
          units: property.units,
          precision: property.precision,
        };
      };
      const { sum, count, min, max, units, precision }: any = await this.aggregatePropertyValues(
        model,
        dbids,
        propName,
        aggregateFunc,
        initialValue
      );
      if (count > 0) {
        const category = propName;
        this.addProperty('Count', count, category);
        this.addProperty('Sum', this.toDisplayUnits(sum, units, precision), category);
        this.addProperty('Avg', this.toDisplayUnits(sum / count, units, precision), category);
        this.addProperty('Min', this.toDisplayUnits(min, units, precision), category);
        this.addProperty('Max', this.toDisplayUnits(max, units, precision), category);
      }
    }
  }

  async aggregatePropertyValues(model: any, dbids: any, propertyName: any, aggregateFunc: any, initialValue: any = 0) {
    return new Promise(function (resolve, reject) {
      let aggregatedValue = initialValue;
      model.getBulkProperties(
        dbids,
        { propFilter: [propertyName] },
        function (results: any) {
          for (const result of results) {
            if (result.properties.length > 0) {
              const prop = result.properties[0];
              aggregatedValue = aggregateFunc(aggregatedValue, prop.displayValue, prop);
            }
          }
          resolve(aggregatedValue);
        },
        reject
      );
    });
  }

  toDisplayUnits(value: any, units: any, precision: any) {
    return window.Autodesk.Viewing.Private.formatValueWithUnits(value, units, 3, precision);
  }
}
