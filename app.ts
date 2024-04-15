import { Console } from 'console';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-stringify';

function processFile(filePath: string, fileName: string) {
    try {
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
            traverseDirectory(filePath, fileName);
        } else {
            if (filePath.includes('.dll') || filePath.includes('.pubxml')) return;

            const data = fs.readFileSync(filePath, 'utf8');
            if (data.length > 0) {
                const targetSubstring = "SELECT *";
                if (data.includes(targetSubstring)) {
                    myLogger.log({ filePath })
                    const file = filePath.split('//').reverse()[0];

                    const lines = data.split('\r\n');;
                    const linesWithSubstring = lines.filter(line => line.includes(targetSubstring));

                    if (linesWithSubstring) {
                        const storedProcedureNames = linesWithSubstring.map(lineWithSubstring => {
                            const matching = lineWithSubstring.match(/"([^"]+)"/);
                            const storedProcedureName = matching ? matching[1] : '';
                            count = count + 1;
                            return { file, storedProcedureName };
                        });

                        storeProceduresFound = storeProceduresFound.concat(storedProcedureNames);

                        myLogger.table(storedProcedureNames);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error processing file:', err);
    }
}

function traverseDirectory(dir: string, fileName: string) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            processFile(filePath, fileName);
        });
    } catch (err) {
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

let globalStoreProcedures: { file: string; storedProcedureName: string }[] = [];
let globalCount = 0;
let globalFileName = 'global-select';

//#endregion

//#region Local to the projects
let count = 0;
let storeProceduresFound: { file: string; storedProcedureName: string }[] = [];

let myLogger = new Console({
    stdout: fs.createWriteStream(`stdout.txt`), // Save normal logs here
    stderr: fs.createWriteStream("errStdErr.txt"),    // Save error logs here
});

projects.forEach(project => {
    count = 0;
    storeProceduresFound = [];
    const directoryPath: string = project;
    const fileName = directoryPath.replaceAll(':', '').replaceAll('/', '-').replaceAll('.', '');

    myLogger = new Console({
        stdout: fs.createWriteStream(`${fileName}-select.txt`),
        stderr: fs.createWriteStream("errStdErr.txt"),
    });

    traverseDirectory(directoryPath, fileName);

    csv.stringify(storeProceduresFound, (err, output) => {
        if (err) {
            console.error('Error creating CSV:', err);
            return;
        }
        fs.writeFileSync(`${fileName}-select.csv`, output);
    });

    console.table(storeProceduresFound);
    console.log({ fileName, count })
    myLogger.table({ count })

    //Set the global
    globalStoreProcedures = globalStoreProcedures.concat(storeProceduresFound);
    globalCount = globalCount + count;
})

//#endregion

//#region Global SP

myLogger = new Console({
    stdout: fs.createWriteStream(`${globalFileName}.txt`), // Save normal logs here
    stderr: fs.createWriteStream("errStdErr.txt"),    // Save error logs here
});

csv.stringify(globalStoreProcedures, (err, output) => {
    if (err) {
        console.error('Error creating CSV:', err);
        return;
    }
    fs.writeFileSync(`${globalFileName}.csv`, output);
});

myLogger.table(globalStoreProcedures);

//#endregion