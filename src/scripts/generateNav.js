// to run in CMD : node --experimental-modules src/scripts/generateNav.js

import fs from 'fs';
import path from 'path';

//--------------------Directory readout-----------------------------------

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
const { filePaths, fileNames, fileContents } = findMarkdownFiles('src/pages/posts')


//----------------------Menu JS Object---------------------------------

function generateAccordionMenu(filePaths, fileNames) {
    // Initialize an empty object to store the accordion menu structure
    const accordionMenu = {};

    // Loop through each filePath
    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        const fileName = fileNames[i].replace('.md', '');       
        const segments = filePath.split('/');

        // Start from the root of the accordionMenu
        let currentLevel = accordionMenu;

        // Traverse the segments of the filePath to build the nested structure
        for (let j = 0; j < segments.length - 1; j++) {
            const segment = segments[j];

            // If the current segment doesn't exist in the current level, create it
            if (!currentLevel[segment]) {
                currentLevel[segment] = {};
            }

            // Move to the next level
            currentLevel = currentLevel[segment];
        }

        // At the end of the traversal, add the markdown file as a leaf node
        currentLevel[fileName] = filePath;
    }

    return accordionMenu;
}
const accordionMenu = generateAccordionMenu(filePaths, fileNames);

console.log(JSON.stringify(accordionMenu, null, 2));


//----------------------Menu JS to HTML---------------------------------

function generateAccordionHTML(menu, parentPath = '') {
    let html = '<div class="accordion" transition:persist>';
    // Iterate over the keys (folders) in the menu
    for (const folder in menu) {
        if (Object.prototype.hasOwnProperty.call(menu, folder)) { // Use Object.prototype.hasOwnProperty to check
            const fullPath = path.join(parentPath, folder);
            if (menu[folder] instanceof Object) {
                // If it's a folder, recursively call generateAccordionHTML
                html += `<details class="accordion-item">
                            <summary class="accordion-header">
                                ${folder}
                            </summary>
                            <div class="accordion-body">
                                ${generateAccordionHTML(menu[folder], fullPath)}
                            </div>
                        </details>`;
            } else {
                // If it's a file, create a link
                const filePath = menu[folder];
                html += `<div class="accordion-item">
                            <a href="${'/posts/'+(fullPath).replace('\\', '/')+'/'}" class="accordion-link">${folder}</a>
                        </div>`;
            }
        }
    }
    html += '</div>';
    return html;
}
const accordionHTML = generateAccordionHTML(accordionMenu);

fs.writeFileSync('src/components/Menu.astro', accordionHTML);

export {}; // This line ensures that this file is treated as a module even if it doesn't explicitly export anything
