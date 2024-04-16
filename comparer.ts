const csv = require('csvtojson');
const XLSX = require('xlsx');
import * as csvString from 'csv-stringify';
import { Console } from 'console';
import * as fs from 'fs';

let files = ['C:/Users/DamiánTrinca/OneDrive - Adviters/Documents/sp-db.csv', 'C:/Users/DamiánTrinca/OneDrive - Adviters/Documents/sp-code.csv'];
let allDBFile = 'C:/Users/DamiánTrinca/Downloads/AllDbsSP.xlsx';

let spdb: any[] = [];
let spcode: any[] = [];
let myLogger = new Console({
    stdout: fs.createWriteStream(`files/comparer-sp.txt`), // Save normal logs here
    stderr: fs.createWriteStream("files/comparerErrStd.txt"),    // Save error logs here
});

function compareFiles(array1: string[], array2: string[]) {

    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const commonElements = array2.filter(item => set1.has(item));

    const nonMatchingElementsArray1 = array1.filter(item => !set2.has(item));
    const nonMatchingElementsArray2 = array2.filter(item => !set1.has(item));

    const nonMatchingElements = nonMatchingElementsArray1.concat(nonMatchingElementsArray2);

    const setCommonElements = new Set(commonElements);
    const setNonMatchingElements = new Set(nonMatchingElements);
    console.table(setCommonElements);
    console.table(setNonMatchingElements);

    myLogger.table("commonElements")
    myLogger.table(setCommonElements)
    myLogger.table("nonMatchingElements")
    myLogger.table(setNonMatchingElements)
    myLogger.table([{ Detail: 'commonElements', Count: setCommonElements.size }, { Detail: 'nonMatchingElements', Count: setNonMatchingElements.size }])

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

function compareFilesWithAllDbDetail(spCodeArray: string[], detailSpArray: DetailSp[]) {

    const setSpCode = new Set(spCodeArray);

    const commonElements = detailSpArray.filter(item => setSpCode.has(item.SpName));
    const nonMatchingElements = detailSpArray.filter((item: DetailSp) => !setSpCode.has(item.SpName));

    myLogger.table("commonElements")
    myLogger.table(commonElements)
    myLogger.table("nonMatchingElements")
    myLogger.table(nonMatchingElements)
    myLogger.table([{ Detail: 'commonElements', Count: commonElements.length }, { Detail: 'nonMatchingElements', Count: nonMatchingElements.length }])

    csvString.stringify(commonElements, (err, output) => {
        if (err) {
            console.error('Error creating CSV:', err);
            return;
        }
        fs.writeFileSync(`files/commonElements.csv`, output);
    });

    csvString.stringify(nonMatchingElements, (err, output) => {
        if (err) {
            console.error('Error creating CSV:', err);
            return;
        }
        fs.writeFileSync(`files/nonMatchingElements.csv`, output);
    });
}


function readFiles() {
    csv()
        .fromFile(files[1]) // Code SP
        .then((jsonArrayObj: any[]) => {
            spcode = jsonArrayObj.map(p => p.SpName);
            csv()
                .fromFile(files[0]) // DB old SP
                .then((jsonArrayObj: any[]) => {
                    spdb = jsonArrayObj.map(p => p.SpName);
                    // compareFiles(spdb, spcode);
                })

        })

}

async function readFile(path: string) {
    const jsonArrayObj = await csv().fromFile(path);
    return jsonArrayObj.map((p: any) => p.SpName);
}

function readExcelFile(path: string) {
    try {
        const workbook = XLSX.readFile(path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        return rows;
    } catch (error: any) {
        console.error('Error reading Excel file:', error.message);
    }
}

readFile(files[1]).then(result => {
    const allDbsSP: DetailSp[] = readExcelFile(allDBFile);
    compareFilesWithAllDbDetail(result, allDbsSP)
});

export interface DetailSp {
    Schema: string,
    SpName: string,
    DbName: string,
}




