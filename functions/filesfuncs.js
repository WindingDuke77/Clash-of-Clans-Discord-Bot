const fs = require("fs");

function getAllFiles(directory) {
  let files = [];
  if (!fs.existsSync(directory)) {
    return files;
  }
  fs.readdirSync(directory).forEach((file) => {
    if (fs.statSync(directory + "/" + file).isDirectory()) {
      files = files.concat(getAllFiles(directory + "/" + file));
    } else {
      files.push(directory + "/" + file);
    }
  });

  return files;
}

module.exports = { getAllFiles };
