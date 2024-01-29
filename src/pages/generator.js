const fs = require('fs');
const path = require('path');

//-------------------------------------------------------
// Directory readout

function findMarkdownFiles(directory, parentPath = '', filePaths = [], fileNames = [], fileContents = []) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(file => {
        const filePath = path.join(directory, file.name);
        const relativePath = path.join(parentPath, file.name);
        
        if (file.isDirectory()) {
            findMarkdownFiles(filePath, relativePath, filePaths, fileNames, fileContents);
        } else if (file.isFile() && path.extname(file.name) === '.md') {
            filePaths.push(relativePath.replace(/\\/g, '/'));
            fileNames.push(file.name);
            fileContents.push(fs.readFileSync(filePath, 'utf8'));
        }
    });
    return { filePaths, fileNames, fileContents }; // Include fileNames in the returned object
}
const { filePaths, fileNames, fileContents } = findMarkdownFiles('posts')