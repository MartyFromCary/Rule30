"use strict";
const rule28 =  [0,0,1,1,1,0,0,0];	// x1C
const rule30 =  [0,1,1,1,1,0,0,0];	// x1E
const rule50 =  [0,1,0,0,1,1,0,0];	// x32
const rule54 =  [0,1,1,0,1,1,0,0];	// x36
const rule58 =  [0,1,0,1,1,1,0,0];	// x3A
const rule90 =  [0,1,0,1,1,0,1,0];	// x5A
const rule110 = [0,1,1,1,0,1,1,0];	// x6E
const rule114 = [0,1,0,0,1,1,1,0];	// x72
const rule122 = [0,1,0,1,1,1,1,0];	// x7A
const rule178 = [0,1,0,0,1,1,0,1];	// xB2
const rule184 = [0,0,0,1,1,1.0,1];	// xB8
const rule186 = [0,1,0,1,1,1,0,1];	// xBA
const rule242 = [0,1,0,0,1,1,1,1];	// xF2
const rule250 = [0,1,0,1,1,1,1,1];	// xFA

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

const generateCells = rule => {

	let leftCell;
	let midCell = 0;
	let rightCell = 0;
	for (let cellIndex = cellIndexStart; cellIndex <= cellIndexEnd; cellIndex++) {
		leftCell = midCell;
		midCell = rightCell;
		rightCell = currCells[cellIndex + 1];

		nextCells[cellIndex] = rule[(((leftCell << 1) + midCell) << 1) + rightCell];
	}

	[currCells, nextCells] = [nextCells, currCells];
};

const draw = () => {
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
			generateCells(rule30);

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
	canvasMidPoint = frameWidth >> 1;
	if ((frameWidth & 1) == 0) { // frameWidth is even
		canvasMidPoint--;
		frameWidth = (canvasMidPoint << 1) + 1; // make frameWidth odd
	}

	canvasWidth = frameWidth;
	canvasHeight = canvasMidPoint;

	myCanvas = $("#myCanvas")[0];
	myCanvas.width = canvasWidth;
	myCanvas.height = canvasHeight;
	canvasContext = myCanvas.getContext('2d');
	canvasContext.fillStyle = "white";
	canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
	canvasImage = canvasContext.createImageData(canvasWidth, canvasHeight);

	draw();
});