"use strict";

var currCells;
var nextCells;

const black = [0, 0, 0];
const lightYellow = [255, 255, 0xb3];

const pixelArray = [lightYellow, black];

var myFrame;
var frameWidth;

var myCanvas;
var canvasWidth;
var canvasMidPoint;
var canvasHeight;
var cellIndexStart;
var cellIndexEnd;

const putPixel = (imageParts, imageIndex, pixelParts) => {
	imageParts[imageIndex++] = pixelParts[0]; // red
	imageParts[imageIndex++] = pixelParts[1]; // green
	imageParts[imageIndex++] = pixelParts[2]; // blue
	imageParts[imageIndex] = 255; // opacity
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
	canvasContext.putImageData(canvasImage, 0, 0);
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

	canvasWidth = frameWidth;
	canvasHeight = canvasMidPoint;

	draw(30);
});