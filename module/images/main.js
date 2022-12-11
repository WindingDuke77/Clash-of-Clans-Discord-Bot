const fs = require("fs");

function returnImage(type, name) {
  let image = `module/images/stoarge/${type}/${name}.png`;
  if (fs.existsSync(image)) {
    return image;
  }
  image = `./module/images/stoarge/404.png`;
  return image;
}

module.exports = { returnImage };
