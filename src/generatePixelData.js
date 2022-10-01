/**
 * [
 *      ['red', null],
 *      [null, null],
 * ]
 *
 */

const generatePixelData = ({
  pixelSize = 10,
  width = 1500,
  height = 1000,
} = {}) => {
  const colMax = width / pixelSize;
  const rowMax = height / pixelSize;

  const pixelData = [];

  for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
    const row = [];
    for (let colIndex = 0; colIndex < colMax; colIndex++) {
      row.push(null);
    }
    pixelData.push(row);
  }

  return pixelData;
};

export default generatePixelData;
