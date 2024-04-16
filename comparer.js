"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var csv = require('csvtojson');
var XLSX = require('xlsx');
var csvString = require("csv-stringify");
var console_1 = require("console");
var fs = require("fs");
var files = ['C:/Users/DamiánTrinca/OneDrive - Adviters/Documents/sp-db.csv', 'C:/Users/DamiánTrinca/OneDrive - Adviters/Documents/sp-code.csv'];
var allDBFile = 'C:/Users/DamiánTrinca/Downloads/AllDbsSP.xlsx';
var spdb = [];
var spcode = [];
var myLogger = new console_1.Console({
    stdout: fs.createWriteStream("files/comparer-sp.txt"), // Save normal logs here
    stderr: fs.createWriteStream("files/comparerErrStd.txt"), // Save error logs here
});
function compareFiles(array1, array2) {
    var set1 = new Set(array1);
    var set2 = new Set(array2);
    var commonElements = array2.filter(function (item) { return set1.has(item); });
    var nonMatchingElementsArray1 = array1.filter(function (item) { return !set2.has(item); });
    var nonMatchingElementsArray2 = array2.filter(function (item) { return !set1.has(item); });
    var nonMatchingElements = nonMatchingElementsArray1.concat(nonMatchingElementsArray2);
    var setCommonElements = new Set(commonElements);
    var setNonMatchingElements = new Set(nonMatchingElements);
    console.table(setCommonElements);
    console.table(setNonMatchingElements);
    myLogger.table("commonElements");
    myLogger.table(setCommonElements);
    myLogger.table("nonMatchingElements");
    myLogger.table(setNonMatchingElements);
    myLogger.table([{ Detail: 'commonElements', Count: setCommonElements.size }, { Detail: 'nonMatchingElements', Count: setNonMatchingElements.size }]);
    // csvString.stringify(commonElements, (err, output) => {
    //     if (err) {
    //         console.error('Error creating CSV:', err);
    //         return;
    //     }
    //     fs.writeFileSync(`files/commonElements.csv`, output);
    // });
    // csvString.stringify(nonMatchingElements, (err, output) => {
    //     if (err) {
    //         console.error('Error creating CSV:', err);
    //         return;
    //     }
    //     fs.writeFileSync(`files/nonMatchingElements.csv`, output);
    // });
}
function compareFilesWithAllDbDetail(spCodeArray, detailSpArray) {
    var setSpCode = new Set(spCodeArray);
    var commonElements = detailSpArray.filter(function (item) { return setSpCode.has(item.SpName); });
    var nonMatchingElements = detailSpArray.filter(function (item) { return !setSpCode.has(item.SpName); });
    myLogger.table("commonElements");
    myLogger.table(commonElements);
    myLogger.table("nonMatchingElements");
    myLogger.table(nonMatchingElements);
    myLogger.table([{ Detail: 'commonElements', Count: commonElements.length }, { Detail: 'nonMatchingElements', Count: nonMatchingElements.length }]);
    csvString.stringify(commonElements, function (err, output) {
        if (err) {
            console.error('Error creating CSV:', err);
            return;
        }
        fs.writeFileSync("files/commonElements.csv", output);
    });
    csvString.stringify(nonMatchingElements, function (err, output) {
        if (err) {
            console.error('Error creating CSV:', err);
            return;
        }
        fs.writeFileSync("files/nonMatchingElements.csv", output);
    });
}
function readFiles() {
    csv()
        .fromFile(files[1]) // Code SP
        .then(function (jsonArrayObj) {
        spcode = jsonArrayObj.map(function (p) { return p.SpName; });
        csv()
            .fromFile(files[0]) // DB old SP
            .then(function (jsonArrayObj) {
            spdb = jsonArrayObj.map(function (p) { return p.SpName; });
            // compareFiles(spdb, spcode);
        });
    });
}
function readFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonArrayObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, csv().fromFile(path)];
                case 1:
                    jsonArrayObj = _a.sent();
                    return [2 /*return*/, jsonArrayObj.map(function (p) { return p.SpName; })];
            }
        });
    });
}
function readExcelFile(path) {
    try {
        var workbook = XLSX.readFile(path);
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        var rows = XLSX.utils.sheet_to_json(sheet);
        return rows;
    }
    catch (error) {
        console.error('Error reading Excel file:', error.message);
    }
}
readFile(files[1]).then(function (result) {
    var allDbsSP = readExcelFile(allDBFile);
    compareFilesWithAllDbDetail(result, allDbsSP);
});
