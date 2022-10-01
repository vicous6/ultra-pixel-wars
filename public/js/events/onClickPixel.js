const onClickPixel = ({ canvasEl, pixelSize, callback }) => {
  canvasEl.addEventListener("click", (evt) => {
   
    const x = evt.offsetX;
    const y = evt.offsetY;

 

    const colIndex = Math.floor(x / pixelSize);
    const rowIndex = Math.floor(y / pixelSize);

  
    if (typeof callback === "function") {
      callback({
        rowIndex,
        colIndex,
      });
    }
  });
};

export default onClickPixel;
