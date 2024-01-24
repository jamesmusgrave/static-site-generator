const fs = require('fs');
const path = require('path');

const directoryPath = './originals'; 

const readImages = (dirPath, images = {}) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    if (isDirectory) {
      images[file] = readImages(filePath, []);
    } else if (/\.(jpe?g|png|gif)$/i.test(filePath)) {
      images.push(file);
    }
  });
  return images;
};

const imageObject = readImages(directoryPath);

const outputFilePath = 'images.json';

fs.writeFile(outputFilePath, JSON.stringify(imageObject, null, 2), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`File saved to ${outputFilePath}`);
});