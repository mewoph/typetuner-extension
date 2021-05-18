export const getDataUrl = (file) => {
  const fileReader = new FileReader();
  return new Promise((resolve) => {
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  });
};

export const getFontFamily = (opentypeData, locale='en') => {
  const { names } = opentypeData || {};
  if (names) {
    return names.fontFamily[locale];
  }
};

export const getVariationAxes = (opentypeData) => {
  const { tables = {} } = opentypeData || {};
  if (!tables.fvar) {
    return [];
  }
  return tables.fvar.axes;
};