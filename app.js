"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
function traverseDirectory(dir) {

    fs.readdir(dir, function (err, files) {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        files.forEach(function (file) {
            var filePath = path.join(dir, file);
            fs.stat(filePath, function (err, stats) {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }
                if (stats.isDirectory()) {
                    traverseDirectory(filePath);
                }
                else {
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

}
// Call the function with the directory path you want to traverse
var globalCount = 0;
var directoryPath = 'C:/Dev/Efecty.SiewebLive';
// C:\Dev\Probando
traverseDirectory(directoryPath);
