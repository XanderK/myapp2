const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const promisify = require('util').promisify;
const sharp = require('sharp');
const mkdirp = promisify(require('mkdirp'));
const helpers = require('./helpers');

// Каталог в котором будут храниться изображения
const imagesDirectoryBase = path.join(__dirname, '../data/files');

// Суффикс для названия файла с малым изображением
const thumbSuffix = '-thumb';

// Сохраняет малое изображение 
async function makeThumb(fileName) {
  let fileInfo = path.parse(fileName);
  let thumbFileName = path.join(fileInfo.dir, fileInfo.name + thumbSuffix + fileInfo.ext);

  // удалим thumb
  if(await helpers.doesFileExist(thumbFileName)) {
    await fsPromises.unlink(thumbFileName);
  }
  
  // преобразование изображения к 160x120
  const imageOptions = {
    width: 160,
    hight: 120,
    fit: sharp.fit.cover,
    position: sharp.strategy.entropy,
    kernel: sharp.kernel.nearest
  };
  try {
    await sharp(fileName).resize(imageOptions).sharpen().toFile(thumbFileName);
  }
  catch (e) {
    console.log(e);
  }
}

// Сохраняет base64String в файл JPEG
async function base64ToJpeg(fileName, base64String) {
  const base64Image = base64String.split(';base64,').pop();
  const writeFile = promisify(fs.writeFile);
  return await writeFile(fileName, base64Image, { encoding: 'base64' });
}

// Сохранеие изображений.
// Возвращает список файлов.
module.exports.saveImages = async (id, images) => {
  let currentDate = new Date();
  const imagesDirectory = path.join(currentDate.getFullYear().toString(), (currentDate.getMonth() + 1).toPrecision(2));
  let imagesPath = path.join(imagesDirectoryBase, imagesDirectory);

  console.log(imagesPath);

  // Создание каталога для хранения изображений
  if (!fs.existsSync(imagesPath)) {
    //fs.mkdirSync(imagesPath);
    await mkdirp(imagesPath);
    console.log('Directory ' + imagesPath + ' created.');
  }

  let files = new Array();
  for (let i = 0; i < images.length; i++) {
    // Формирование названия для файла с изображением как: "productId-1.jpg"
    let fileName = id + '-' + (i+1) + '.jpg';
    let fullFileName = path.join(imagesPath, fileName);
    try {
      // Сохранение большого изображения
      await base64ToJpeg(fullFileName, images[i]);
      files.push(path.join(imagesDirectory, fileName));

      // Формирование малого изображения как: "productId-1-thumb.jpg"
      await makeThumb(fullFileName);
    }
    catch (e) {
      console.log(e);
    }
  }
  return files;
};

// Удаление изображений.
module.exports.deleteImages = async (fileNameMask) => {
  const unlink = promisify(fs.unlink);
  try {
    await unlink(fileNameMask);
  }
  catch(e) {
    console.log(e);
  }
};

