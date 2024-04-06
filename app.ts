import * as fs from 'fs';
import * as path from 'path';

function traverseDirectory(dir: string): void {
    let count = 0;

    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dir, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    traverseDirectory(filePath);
                } else {
                    if (filePath.includes('.dll')) return;
                    if (filePath.includes('.pubxml')) return;
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            console.error('Error reading file:', err);
                            return;
                        }
                        if (data.length > 0) {
                            const targetSubstring = "GetStoredProcCommand";
                            if (data.includes(targetSubstring)) {
                                console.log('File:', filePath);
                                const lines = data.split('\n');
                                const lineWithSubstring = lines.find(line => line.includes(targetSubstring));

                                if (lineWithSubstring) {
                                    console.log(`Line with the target substring: ${lineWithSubstring}`);
                                }
                            }

                        }

                    });
                }
            });
        });

    });


    console.log({ count })
}

// Call the function with the directory path you want to traverse
const directoryPath = 'C:/Dev/Efecty.SiewebLive/Efecty.AlertasVentas.Servicio';
// C:\Dev\Probando
traverseDirectory(directoryPath);
