"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var console_1 = require("console");
var fs = require("fs");
var path = require("path");
function processFile(filePath) {
    try {
        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            traverseDirectory(filePath);
        }
        else {
            if (filePath.includes('.dll') || filePath.includes('.pubxml'))
                return;
            var data = fs.readFileSync(filePath, 'utf8');
            if (data.length > 0) {
                var targetSubstring_1 = "GetStoredProcCommand";
                if (data.includes(targetSubstring_1)) {
                    myLogger.table({ filePath: filePath });
                    var file_1 = filePath.split('//').reverse()[0];
                    var lines = data.split('/n');
                    var linesWithSubstring = lines.filter(function (line) { return line.includes(targetSubstring_1); });
                    if (linesWithSubstring) {
                        var storedProcedureNames = linesWithSubstring.map(function (lineWithSubstring) {
                            var matching = lineWithSubstring.match(/"([^"]+)"/);
                            var storedProcedureName = matching ? matching[1] : '';
                            count = count + 1;
                            return { file: file_1, storedProcedureName: storedProcedureName };
                        });
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
function traverseDirectory(dir) {
    try {
        var files = fs.readdirSync(dir);
        files.forEach(function (file) {
            var filePath = path.join(dir, file);
            processFile(filePath);
        });
    }
    catch (err) {
        console.error('Error reading directory:', err);
    }
}
// Call the function with the directory path you want to traverse
// const directoryPath = 'C:/Dev/Efecty.SiewebLive'; Listo
// const directoryPath = 'C:/Dev/Efecty.CB.DispersionPagos'; Listo
// const directoryPath = 'C:/Dev/Efecty.CB.Monitor'; Ready
// const directoryPath = 'C:/Dev/Efecty.CB.Service'; Ready
// const directoryPath = 'C:/Dev/Efecty.CB.Socket'; Ready
// const directoryPath = 'C:/Dev/Efecty.CB.Transacciones'; Ready
var projects = [
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
var count = 0;
var directoryPath = 'C:/Dev/Efecty.CB.Transacciones';
var fileName = directoryPath.replaceAll(':', '').replaceAll('/', '-').replaceAll('.', '');
var myLogger = new console_1.Console({
    stdout: fs.createWriteStream("".concat(fileName, ".txt")), // Save normal logs here
    stderr: fs.createWriteStream("errStdErr.txt"), // Save error logs here
});
// C:/Dev/Probando
traverseDirectory(directoryPath);
myLogger.table({ count: count });
