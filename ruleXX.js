"use strict";

var currCells;
var nextCells;

const black = [0, 0, 0];
const lightYellow = [255, 255, 0xb3];

const pixelArray = [lightYellow, black];

var myFrame;
var frameWidth;

var myCanvas;
//var canvasWidth;
var canvasMidPoint;
//var canvasHeight;
var cellIndexStart;
var cellIndexEnd;

const putPixel = (imageParts, imageIndex, pixelParts) => {
	imageParts[imageIndex++] = pixelParts[0]; // red
	imageParts[imageIndex++] = pixelParts[1]; // green
	imageParts[imageIndex++] = pixelParts[2]; // blue
	imageParts[imageIndex] = 255; // opacity
}

// adapted from:
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
function putImageData(ctx, imageData) {
	const data = imageData.data;
	const height = imageData.height;
	const width = imageData.width;

	for (let y = 0; y < height; y++) {
		let ypos = y * width;
		for (let x = 0; x < width; x++) {
			let xpos = (ypos + x) * 4;
			ctx.fillStyle = 'rgba(' + data[xpos] + ',' + data[xpos + 1] + ',' + data[xpos + 2] + ',' + (data[xpos + 3] / 255) + ')';
			ctx.fillRect(x, y, 1, 1);
		}
	}
}

const val2Array = value => {
	let arry = [];
	for (let i = 0; i < 8; i++) {
		arry.push(value & 1);
		value >>= 1;
	}
	return arry;
}

const draw = ruleVal => {
	var canvasWidth = frameWidth;
	var canvasHeight = canvasMidPoint;

	myCanvas.width = canvasWidth;
	myCanvas.height = canvasHeight;

	const canvasContext = myCanvas.getContext('2d');
	canvasContext.fillStyle = "white";
	canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
	const canvasImage = canvasContext.createImageData(canvasWidth, canvasHeight);

	const ruleArry = val2Array(ruleVal);
	let leftCell,
		midCell,
		rightCell;
	let rowIndex;

	currCells = new Array(canvasWidth).fill(0);
	nextCells = new Array(canvasWidth).fill(0);

	rowIndex = 0;
	cellIndexStart = canvasMidPoint;
	cellIndexEnd = canvasMidPoint;
	for (let lineNr = 0; lineNr < canvasHeight; lineNr++) {

		if (lineNr == 0)
			currCells[canvasMidPoint] = 1;
		else {
			midCell = 0;
			rightCell = 0;
			for (let cellIndex = cellIndexStart; cellIndex <= cellIndexEnd; cellIndex++) {
				leftCell = midCell;
				midCell = rightCell;
				rightCell = currCells[cellIndex + 1];

				nextCells[cellIndex] = ruleArry[(((leftCell << 1) + midCell) << 1) + rightCell];
			} [currCells, nextCells] = [nextCells, currCells];
		}

		for (let i = cellIndexStart; i <= cellIndexEnd; i++) {
			putPixel(canvasImage.data, (rowIndex + i) * 4, pixelArray[currCells[i]]);
		}

		rowIndex += canvasWidth;
		cellIndexStart--;
		cellIndexEnd++;
	}
	// canvasContext.putImageData(canvasImage, 0, 0); putImageData(canvasContext,
	// canvasImage); function putImageData(ctx, imageData)

	rowIndex = 0;
	for (let lineNr = 0; lineNr < canvasHeight; lineNr++) {
		for (let i = 0; i < canvasWidth; i++) {
			let xpos = (rowIndex + i) * 4;
			canvasContext.fillStyle = 'rgba(' + canvasImage.data[xpos] + ',' + canvasImage.data[xpos + 1] + ',' + canvasImage.data[xpos + 2] + ',' + (canvasImage.data[xpos + 3] / 255) + ')';
			canvasContext.fillRect(i, lineNr, 1, 1);
		}
		rowIndex += canvasWidth;
	}

};

$(() => {
	myFrame = $("#myFrame");
	myCanvas = $("#myCanvas")[0];

	frameWidth = $("#myFrame").width();

	canvasMidPoint = frameWidth >> 1;
	if ((frameWidth & 1) == 0) { // frameWidth is even
		canvasMidPoint--;
		frameWidth = (canvasMidPoint << 1) + 1; // make frameWidth odd
	}

	draw(30);
});