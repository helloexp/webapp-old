/* eslint no-console:0 */
const fs = require('fs');

function removeDir(dirPath, removeSelf) {
  if (removeSelf === undefined) {
    removeSelf = true;
  } else if (parseInt(removeSelf, 10) === 0) {
    removeSelf = false;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  }

  let files;

  try {
    files = fs.readdirSync(dirPath);
  } catch (error) {
    if (error.errno !== -2) {
      console.log(error);
    }

    return;
  }

  if (files.length > 0) {
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const filePath = `${dirPath}/${files[fileIndex]}`;

      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        removeDir(filePath);
      }
    }
  }

  if (removeSelf) {
    fs.rmdirSync(dirPath);
  }
}

removeDir('./coverage', process.argv[2]);
