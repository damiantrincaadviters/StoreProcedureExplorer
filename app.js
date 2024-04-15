"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var console_1 = require("console");
var fs = require("fs");
var path = require("path");
var csv = require("csv-stringify");
function processFile(filePath, fileName) {
    try {
        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath, fileName);
        }
        else {
            if (filePath.includes('.dll') || filePath.includes('.pubxml'))
                return;
            var data = fs.readFileSync(filePath, 'utf8');
            if (data.length > 0) {
                var targetSubstring_1 = "SELECT *";
                if (data.includes(targetSubstring_1)) {
                    myLogger.log({ filePath: filePath });
                    var file_1 = filePath.split('//').reverse()[0];
                    var lines = data.split('\r\n');
                    ;
                    var linesWithSubstring = lines.filter(function (line) { return line.includes(targetSubstring_1); });
                    if (linesWithSubstring) {
                        var storedProcedureNames = linesWithSubstring.map(function (lineWithSubstring) {
                            var matching = lineWithSubstring.match(/"([^"]+)"/);
                            var storedProcedureName = matching ? matching[1] : '';
                            count = count + 1;
                            return { file: file_1, storedProcedureName: storedProcedureName };
                        });
                        storeProceduresFound = storeProceduresFound.concat(storedProcedureNames);
                        myLogger.table(storedProcedureNames);
                    }
                }
            }
        }
    }
    catch (err) {
        console.error('Error processing file:', err);
    }
}
function traverseDirectory(dir, fileName) {
    try {
        var files = fs.readdirSync(dir);
        files.forEach(function (file) {
            var filePath = path.join(dir, file);
            processFile(filePath, fileName);
        });
    }
    catch (err) {
        console.error('Error reading directory:', err);
    }
}
//#region Global Var
var projects = [
    'C:/Dev/Efecty.SiewebLive',
    'C:/Dev/Efecty.CB.DispersionPagos',
    'C:/Dev/Efecty.CB.Monitor',
    'C:/Dev/Efecty.CB.Service',
    'C:/Dev/Efecty.CB.Socket',
    'C:/Dev/Efecty.CB.Transacciones',
    "C:/Dev/Efecty.Facturacion.Ingestion",
    "C:/Dev/Efecty.Microservicios.Antifraude",
    "C:/Dev/Efecty.Microservicios.Billetera",
    "C:/Dev/Efecty.Microservicios.Biometria",
    "C:/Dev/Efecty.Microservicios.Broker",
    "C:/Dev/Efecty.Microservicios.Contabilidad",
    "C:/Dev/Efecty.Microservicios.Legados",
    "C:/Dev/Efecty.Microservicios.Plataforma.NET_6",
    "C:/Dev/Efecty.Microservicios.Seguridad",
    "C:/Dev/Efecty.Microservicios.Transaccion",
    "C:/Dev/Efecty.Microservicios.YAML",
    "C:/Dev/Efecty.ServicioBiometriaMorpho",
    "C:/Dev/Efecty.SiewebLive",
    "C:/Dev/Efecty.SiewebLive.Integraciones",
    "C:/Dev/Efecty.SiewebLive.PosCache",
    "C:/Dev/Efecty.WebLive.Administracion",
    "C:/Dev/Efecty.WebLive.ClienteEmpresarial",
    "C:/Dev/Efecty.WebLive.Contratistas",
    "C:/Dev/Efecty.WebLive.Impuestos",
    "C:/Dev/Efecty.WebLive.Interfaces",
    "C:/Dev/Efecty.WebLive.Main",
    "C:/Dev/Efecty.WebLive.Presupuesto",
    "C:/Dev/Efecty.WebLive.ReportesHuellaPago",
    "C:/Dev/Efecty.WebLive.Tarificador",
    "C:/Dev/Efecty.WebLive20",
];
var globalStoreProcedures = [];
var globalCount = 0;
var globalFileName = 'global-select';
//#endregion
//#region Local to the projects
var count = 0;
var storeProceduresFound = [];
var myLogger = new console_1.Console({
    stdout: fs.createWriteStream("stdout.txt"), // Save normal logs here
    stderr: fs.createWriteStream("errStdErr.txt"), // Save error logs here
});
projects.forEach(function (project) {
    count = 0;
    storeProceduresFound = [];
    var directoryPath = project;
    var fileName = directoryPath.replaceAll(':', '').replaceAll('/', '-').replaceAll('.', '');
    myLogger = new console_1.Console({
        stdout: fs.createWriteStream("".concat(fileName, "-select.txt")),
        stderr: fs.createWriteStream("errStdErr.txt"),
    });
    traverseDirectory(directoryPath, fileName);
    csv.stringify(storeProceduresFound, function (err, output) {
        if (err) {
            console.error('Error creating CSV:', err);
            return;
        }
        fs.writeFileSync("".concat(fileName, "-select.csv"), output);
    });
    console.table(storeProceduresFound);
    console.log({ fileName: fileName, count: count });
    myLogger.table({ count: count });
    //Set the global
    globalStoreProcedures = globalStoreProcedures.concat(storeProceduresFound);
    globalCount = globalCount + count;
});
//#endregion
//#region Global SP
myLogger = new console_1.Console({
    stdout: fs.createWriteStream("".concat(globalFileName, ".txt")), // Save normal logs here
    stderr: fs.createWriteStream("errStdErr.txt"), // Save error logs here
});
csv.stringify(globalStoreProcedures, function (err, output) {
    if (err) {
        console.error('Error creating CSV:', err);
        return;
    }
    fs.writeFileSync("".concat(globalFileName, ".csv"), output);
});
myLogger.table(globalStoreProcedures);
//#endregion
