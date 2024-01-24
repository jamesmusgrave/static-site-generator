const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Input and output folders
const inputFolder = './originals';
const outputFolder = './images';

// Recursive function to process files and subdirectories
function processFilesInDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    // Loop through all the files and subdirectories in the current directory
    for (const file of files) {
      const filePath = path.join(directory, file);

      // Check if the current item is a file or a directory
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          // Recursively process subdirectories
          processFilesInDirectory(filePath);
        } else {
          // If the item is a JPG file, optimize it and save it in the output folder
          if (path.extname(filePath).toLowerCase() === '.jpg') {
            const outputFile = path.join(outputFolder, path.relative(inputFolder, filePath));
            const outputDirectory = path.dirname(outputFile);

            // Create the output directory if it doesn't exist
            if (!fs.existsSync(outputDirectory)) {
              fs.mkdirSync(outputDirectory, { recursive: true });
            }

            // Optimize the image and save it in the output folder
            sharp(filePath)
            .resize({ width: 1200 })
              .jpeg({ quality: 80 })
              .toFile(outputFile)
              .then(() => console.log(`Optimized ${filePath}`))
              .catch((err) => console.error(`Error optimizing ${filePath}: ${err}`));
          }
        }
      });
    }
  });
}

// Start processing the input folder
processFilesInDirectory(inputFolder);