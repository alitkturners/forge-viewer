export const selectProperties = (value: number[]) => {
    window.viewer.isolate(value);
    window.viewer.fitToView(value);
  };
