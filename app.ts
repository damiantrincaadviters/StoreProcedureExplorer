import { Console } from 'console';
import * as fs from 'fs';
import * as path from 'path';

function processFile(filePath: string) {
    try {
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
            traverseDirectory(filePath);
        } else {
            if (filePath.includes('.dll') || filePath.includes('.pubxml')) return;

            const data = fs.readFileSync(filePath, 'utf8');
            if (data.length > 0) {
                const targetSubstring = "GetStoredProcCommand";
                if (data.includes(targetSubstring)) {
                    myLogger.table({ filePath })
                    const file = filePath.split('//').reverse()[0];
                    const lines = data.split('/n');
                    const linesWithSubstring = lines.filter(line => line.includes(targetSubstring));

                    if (linesWithSubstring) {
                        let storedProcedureNames = linesWithSubstring.map(lineWithSubstring => {
                            const matching = lineWithSubstring.match(/"([^"]+)"/);
                            const storedProcedureName = matching ? matching[1] : '';
                            count = count + 1;
                            return { file, storedProcedureName }
                        })

                        myLogger.table(storedProcedureNames);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error processing file:', err);
    }
}

function traverseDirectory(dir: string) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            processFile(filePath);
        });
    } catch (err) {
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
// "C:/Dev/Efecty.Facturacion.Ingestion"' Ready
// "C:/Dev/Efecty.Microservicios.Antifraude", Ready

var projects = [
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
let count = 0;
let myLogger = new Console({
    stdout: fs.createWriteStream(`stdout.txt`), // Save normal logs here
    stderr: fs.createWriteStream("errStdErr.txt"),    // Save error logs here
});
projects.forEach(project => {
    count = 0;
    const directoryPath: string = project;
    const fileName = directoryPath.replaceAll(':', '').replaceAll('/', '-').replaceAll('.', '');

    myLogger = new Console({
        stdout: fs.createWriteStream(`${fileName}.txt`), // Save normal logs here
        stderr: fs.createWriteStream("errStdErr.txt"),    // Save error logs here
    });

    // C:/Dev/Probando
    traverseDirectory(directoryPath);
    myLogger.table({ count })
})

