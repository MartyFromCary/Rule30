"use strict";

var currCells;
var nextCells;

const black = [0, 0, 0];
const lightYellow = [255, 255, 0xb3];

const pixelArray = [lightYellow, black];

var frameWidth;

var myCanvas;
var canvasWidth;
var canvasMidPoint;
var canvasHeight;
var canvasContext;
var canvasImage;
var cellIndexStart;
var cellIndexEnd;

const putPixelLine = (pixelIndex, pixel) => {
	canvasImage.data[pixelIndex++] = pixel[0]; // red
	canvasImage.data[pixelIndex++] = pixel[1]; // green
	canvasImage.data[pixelIndex++] = pixel[2]; // blue
	canvasImage.data[pixelIndex] = 255; // opacity
}

const val2Array = value => {
	let arry = [];
	for (let i = 0; i < 8; i++) {
		arry.push(value & 1);
		value >>= 1;
	}
	return arry;
}

const generateCells = ruleArry => {

	let leftCell;
	let midCell = 0;
	let rightCell = 0;
	for (let cellIndex = cellIndexStart; cellIndex <= cellIndexEnd; cellIndex++) {
		leftCell = midCell;
		midCell = rightCell;
		rightCell = currCells[cellIndex + 1];

		nextCells[cellIndex] = ruleArry[(((leftCell << 1) + midCell) << 1) + rightCell];
	}

	[currCells, nextCells] = [nextCells, currCells];
};

const draw = ruleVal => {
	const ruleArry = val2Array(ruleVal);
	let rowIndex;

	currCells = new Array(canvasWidth).fill(0);
	nextCells = new Array(canvasWidth).fill(0);

	rowIndex = 0;
	cellIndexStart = canvasMidPoint;
	cellIndexEnd = canvasMidPoint;
	for (let lineNr = 0; lineNr < canvasHeight; lineNr++) {

		if (lineNr == 0)
			currCells[canvasMidPoint] = 1;
		else
			generateCells(ruleArry);

		for (let i = cellIndexStart; i <= cellIndexEnd; i++) {
			putPixelLine((rowIndex + i) * 4, pixelArray[currCells[i]]);
		}

		cellIndexStart--;
		cellIndexEnd++;
		rowIndex += canvasWidth;

	}
	canvasContext.putImageData(canvasImage, 0, 0);
};

$(() => {
	frameWidth = $("#myFrame").width();
	myCanvas = $("#myCanvas")[0];

	canvasMidPoint = frameWidth >> 1;
	if ((frameWidth & 1) == 0) { // frameWidth is even
		canvasMidPoint--;
		frameWidth = (canvasMidPoint << 1) + 1; // make frameWidth odd
	}

	canvasWidth = frameWidth;
	canvasHeight = canvasMidPoint;

	myCanvas.width = canvasWidth;
	myCanvas.height = canvasHeight;
	canvasContext = myCanvas.getContext('2d');
	canvasContext.fillStyle = "white";
	canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
	canvasImage = canvasContext.createImageData(canvasWidth, canvasHeight);

	draw(30);
});