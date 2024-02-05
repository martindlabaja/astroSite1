const fs = require('fs');
const path = require('path');

const imagesFolder = '../astroSite1/src/pages/posts/images';

// Read the contents of the images folder
fs.readdir(imagesFolder, (err, files) => {
  if (err) {
    console.error('Error reading images folder:', err);
    return;
  }

  // Filter out only jpg and png files
  const imageFiles = files.filter(file => {
    return /\.(jpg|png)$/i.test(file);
  });

  // Generate Markdown files
  imageFiles.forEach(file => {
    const markdownFileName = file.replace(/\.(jpg|png)$/i, '.md');
    const markdownContent = `---
layout: ../../../layouts/MarkdownPostLayout.astro
title: ${file}
pubDate: 2024-02-04
description: ${file}
author: Martin D.C.
image:
  url: https://docs.astro.build/assets/full-logo-light.png
  alt: The full Astro logo.  
---

![${file}](${file})`;

    // Specify the full path for the output file
    const outputPath = path.join('src/pages/posts/imagePages', markdownFileName);

    // Write Markdown content to file in the specified output folder
    fs.writeFile(outputPath, markdownContent, err => {
      if (err) {
        console.error(`Error writing Markdown file ${outputPath}:`, err);
        return;
      }
      console.log(`Markdown file ${outputPath} has been generated successfully.`);
    });
  });
});