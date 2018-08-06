"use strict";

const cssCellOff = "#E9EDD6"; //"#FFFFB3";
const cssCellOn = "#933D19"; //"black";

var myRule;
var myRun;
var myFrame;
var myCanvas;
var ruleNr = 30;	/*30 90 92 110*/

// convert numeric rule to binary array (reversed)
const val2Array = value => {
	let arry = [];
	for (let i = 0; i < 8; i++) {
		arry.push(value & 1);
		value >>= 1;
	}
	return arry;
}

const draw = ruleVal => {
	const ruleArry = val2Array(ruleVal);

	// myFrame was set to width:100%;height:100%
	let frameWidth = $("#myFrame").width();

	let canvasMidPoint = frameWidth >> 1;
	if ((frameWidth & 1) == 0) { // frameWidth is even
		canvasMidPoint--;
		frameWidth = (canvasMidPoint << 1) + 1; // make frameWidth odd
	}

	let canvasWidth = frameWidth;
	let canvasHeight = canvasMidPoint;

	// set myCanvas to maximum to display maximum iterations of rule 
	myCanvas.width = canvasWidth;
	myCanvas.height = canvasHeight;

	const canvasContext = myCanvas.getContext('2d');
	// result set of ruleArry forms a triangle pixels outside of triangle remain
	// transparent pre-populate the triangle to cellOff
	canvasContext.fillStyle = cssCellOff;

	canvasContext.beginPath();
	canvasContext.moveTo(canvasMidPoint, 0);	// mid-point top
	canvasContext.lineTo(1, canvasHeight - 1);	// left bottom
	canvasContext.lineTo(canvasWidth - 1, canvasHeight - 1);	// right botton
	canvasContext.fill();

	// Set pixels within triangle according to values generated by ruleArry
	canvasContext.fillStyle = cssCellOn;

	// allocate and initialize containers for cell values
	let currCells = new Array(canvasWidth).fill(0);
	let nextCells = new Array(canvasWidth).fill(0);

	// generate first line
	currCells[canvasMidPoint] = 1;
	canvasContext.fillRect(canvasMidPoint, 0, 1, 1);

	// generate subsequent lines each row (nextCells) is derived by previous row
	// using left,middle,right cells
	let cellIndexStart = canvasMidPoint - 1;
	let cellIndexEnd = canvasMidPoint + 1;
	for (let yCoord = 1; yCoord < canvasHeight; yCoord++) {

		let scope = [0, 0, 0];	// left cell, mid cell, right cell;
		for (let xCoord = cellIndexStart; xCoord <= cellIndexEnd; xCoord++) {
			// shift the scope of cells
			[scope[0], scope[1], scope[2]] = [scope[1], scope[2], currCells[xCoord + 1]];

			let ruleArryIndex = scope[0];
			ruleArryIndex <<= 1;
			ruleArryIndex += scope[1];
			ruleArryIndex <<= 1;
			ruleArryIndex += scope[2];
			let cellValue = ruleArry[ruleArryIndex];
			if (cellValue == 1) {
				canvasContext.fillRect(xCoord, yCoord, 1, 1);
			}
			nextCells[xCoord] = cellValue;
		}

		[currCells, nextCells] = [nextCells, currCells]; // switch pointers for next iteration

		// widen boundaries
		cellIndexStart--;
		cellIndexEnd++;
	}
};

$(() => {
	myRule = $("#myRule");
	myRun = $("#myRun");
	myFrame = $("#myFrame");
	myCanvas = $("#myCanvas")[0];

	myRun.click(() => { draw(ruleNr) });
});