// Generates the accordion navigation menus from markdown pages.
// Outputs two variants:
//   - src/components/Menu.astro     (collapsed accordions)
//   - src/components/MenuOpen.astro (expanded accordions, <details open>)
// Run with: node src/scripts/generateNav.js

import fs from 'fs';
import path from 'path';

//--------------------Directory readout-----------------------------------

function findMarkdownFiles(directory, parentPath = '', filePaths = [], fileNames = [], fileContents = []) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(file => {
        const filePath = path.join(directory, file.name);
        const relativePath = path.join(parentPath, file.name);

        if (file.isDirectory()) {
            findMarkdownFiles(filePath, relativePath, filePaths, fileNames, fileContents);
        } else if (file.isFile() && path.extname(file.name) === '.md' || path.extname(file.name) === '.mdx') {
            filePaths.push(relativePath.replace(/\\/g, '/'));
            fileNames.push(file.name);
            fileContents.push(fs.readFileSync(filePath, 'utf8'));
        }
    });
    return { filePaths, fileNames, fileContents }; // Include fileNames in the returned object
}
const { filePaths, fileNames } = findMarkdownFiles('src/pages/posts');


//----------------------Menu JS Object---------------------------------

function generateAccordionMenu(filePaths, fileNames) {
    // Initialize an empty object to store the accordion menu structure
    const accordionMenu = {};

    // Loop through each filePath
    for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        const fileName = fileNames[i].replace(/\.(md|mdx)$/, '');
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

// Manually-routed menu entries that point outside the generated /posts/ tree.
// The value is used verbatim as the link href (absolute path or full URL).
const customLinks = {
    'about-me': {
        'tldr-portfolio': '/professional-portfolio/',
    },
};
for (const category in customLinks) {
    if (!accordionMenu[category]) accordionMenu[category] = {};
    Object.assign(accordionMenu[category], customLinks[category]);
}

console.log(JSON.stringify(accordionMenu, null, 2));


//----------------------Menu JS to HTML---------------------------------

// `open` controls whether the <details> accordions are expanded by default.
function generateAccordionHTML(menu, open, parentPath = '') {
    let html = '<div class="accordion" transition:persist>';
    // Iterate over the keys (folders) in the menu
    for (const folder in menu) {
        if (Object.prototype.hasOwnProperty.call(menu, folder)) { // Use Object.prototype.hasOwnProperty to check
            const fullPath = path.join(parentPath, folder);
            if (menu[folder] instanceof Object) {
                // If it's a folder, recursively call generateAccordionHTML
                html += `<details class="accordion-item"${open ? ' open' : ''}>
                            <summary class="accordion-header">
                                ${folder}
                            </summary>
                            <div class="accordion-body">
                                ${generateAccordionHTML(menu[folder], open, fullPath)}
                            </div>
                        </details>`;
            } else {
                // If it's a file (or a custom link), create a link.
                // Custom entries store an absolute href (starting with "/" or "http");
                // generated markdown pages are linked under /posts/.
                const target = menu[folder];
                const href = (typeof target === 'string' && /^(https?:|\/)/.test(target))
                    ? target
                    : '/posts/' + fullPath.replace('\\', '/') + '/';
                html += `<div class="accordion-item">
                            <a href="${href}" class="accordion-link">${folder}</a>
                        </div>`;
            }
        }
    }
    html += '</div>';
    return html;
}

fs.writeFileSync('src/components/Menu.astro', generateAccordionHTML(accordionMenu, false));
fs.writeFileSync('src/components/MenuOpen.astro', generateAccordionHTML(accordionMenu, true));

export {}; // This line ensures that this file is treated as a module even if it doesn't explicitly export anything
