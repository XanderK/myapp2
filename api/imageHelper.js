const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const promisify = require('util').promisify;
const sharp = require('sharp');
const mkdirp = promisify(require('mkdirp'));
// const rimraf = require('rimraf');
const helpers = require('./helpers');
const config = require('./config');
const uuidv4 = require('uuid/v4');
const Image = require('./models/Image');

// Каталог в котором будут храниться изображения
const imagesDirectoryBase = path.join(__dirname, '../' + config.product_images_dir);

// Суффикс для названия файла с малым изображением
const thumbSuffix = '-thumb';

// Сохраняет малое изображение 
async function makeThumb(sourceFullFileName, thumbFullFileName) {
  // удалим thumb
  if(await helpers.doesFileExist(thumbFullFileName)) {
    await fsPromises.unlink(thumbFullFileName);
  }
  
  // параметры преобразования изображения в thumb
  const imageOptions = {
    width: 176,
    hight: 132,
    fit: sharp.fit.cover,
    position: sharp.strategy.entropy,
    /*
    Possible interpolation kernels are:
    nearest: Use nearest neighbour interpolation.
    cubic: Use a Catmull-Rom spline.
    mitchell: Use a Mitchell-Netravali spline.
    lanczos2: Use a Lanczos kernel with a=2.
    lanczos3: Use a Lanczos kernel with a=3 (the default).
    */
    kernel: sharp.kernel.cubic
  };
  return await sharp(sourceFullFileName).resize(imageOptions).sharpen().toFile(thumbFullFileName);
}

// Сохраняет base64String в файл JPEG
async function base64ToJpeg(fullFileName, base64String) {
  const base64Image = base64String.split(';base64,').pop();
  const writeFile = promisify(fs.writeFile);
  return await writeFile(fullFileName, base64Image, { encoding: 'base64' });
}

// Сохраняет изображения.
// Возвращает список файлов.
module.exports.saveImages = async (id, images) => {
  let currentDate = new Date();
  const imagesDirectory = path.join(currentDate.getFullYear().toString(), (currentDate.getMonth() + 1).toString().padStart(2, '0'));
  let imagesPath = path.join(imagesDirectoryBase, imagesDirectory);

  // Создание каталога для хранения изображений
  if (!fs.existsSync(imagesPath)) {
    await mkdirp(imagesPath);
    console.log('Directory ' + imagesPath + ' created.');
  }

  let resultImages = new Array();
  for (let i = 0; i < images.length; i++) {
    // Формирование названия для файла с изображением как: "productId-uuid.jpg"
    let fileName = id + '-' + uuidv4().replace(/-/g, '') + '.jpg';
    let fullFileName = path.join(imagesPath, fileName);

    try {
      // Сохранение большого изображения
      try {
        await base64ToJpeg(fullFileName, images[i]);
      }
      catch (e) {
        console.log(e);
      }

      // Формирование малого изображения как: "productId-uuid-thumb.jpg"
      let fileInfo = path.parse(fullFileName);
      let thumbFileName = fileInfo.name + thumbSuffix + fileInfo.ext;
      let fullThunbFileName = path.join(fileInfo.dir, thumbFileName);
      try {
        await makeThumb(fullFileName, fullThunbFileName);
      }
      catch (e) {
        console.log(e);
      }

      resultImages.push(
        new Image({
          thumb: path.join(imagesDirectory, thumbFileName),
          full: path.join(imagesDirectory, fileName)
        })
      );
    }
    catch (e) {
      console.log(e);
    }
  }
  return resultImages;
};

// Удаление изображения
module.exports.deleteImage = async (fileName) => {
  const unlink = promisify(fs.unlink);
  try {
    // await unlink(fileName);
    await unlink(path.join(imagesDirectoryBase, fileName));
  }
  catch(e) {
    console.log(e);
  }
};

// // Удаление изображений
// module.exports.deleteImages = async (fileNameMask) => {
//   const rmrf = promisify(rimraf);
//   const pattern = imagesDirectoryBase + '/**/' + fileNameMask;
//   try {
//     await rmrf(pattern);
//   }
//   catch(e) {
//     console.log(e);
//   }
// };

