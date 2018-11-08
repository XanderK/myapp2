import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

const imagesDirectoryBase = path.join(__dirname, 'files');

module.exports.sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

/*
const readdir = promisify(fs.readdir);

async function myF() {
  let names;
  try {
    {err, names} = await readdir('path/to/dir');
    if (err) {
        // Handle the error.
    }
  } catch (e) {
    console.log('e', e);
  }
  if (names === undefined) {
    console.log('undefined');
  } else {
    console.log('First Name', names[0]);
  }
}

myF();
*/

async function base64ToJpeg(fileName, base64String) {
  const base64Image = base64String.split(';base64,').pop();
  const writeFile = promisify(fs.writeFile);
  return await writeFile(fileName, base64Image, {encoding: 'base64'});
}

// Сохранеие изображений.
// Возвращает список файлов.
module.exports.saveImages = async (id, images) => {
  const imagesDirectory = path.join(Date.now.getFullYear(), Date.now.getMonth().toPrecision(2));
  let imagesPath = path.join(imagesDirectoryBase, imagesDirectory);

  console.log(imagesPath);

  // Создание каталога для хранения изображений
  if(!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath);
    console.log('Directory ' + imagesPath + ' created.');
  }
  
  let files = new Array();
  for(let i=1; i<=images.Length(); i++) {
    // Формирование названия для файла с изображением как: "productId-1.jpg"
    let fileName = id + '-' + i + '.jpg';
    let fullFileName = path.join(imagesPath, fileName);
    try {
      // Сохранение большого изображения
      var err = await base64ToJpeg(fullFileName, image[i]);
      if(err) {
        console.log(err);
      }
      else {
        files.push(path.join(imagesDirectory, fileName));
      }

      // Формирование малого изображения как: "productId-1-thumb.jpg"
      ???

    }
    catch(e) {
      console.log(e);
    }
  }

  return files;
};

// Удаление изображений.
module.exports.deleteImages = async (fileNameMask) => {
  const unlink = promisify(fs.unlink);
  let err = await unlink(fileNameMask);
  if(err) {
    console.log(err);
  }
};

