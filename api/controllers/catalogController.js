const Product = require('../models/Product');
const helpers = require('../helpers');
const imageHelper = require('../imageHelper');


module.exports.lastProducts = async (req, res) => {
  try {
    const products = await Product.find(null, null, {sort: {created : -1}, limit: 4});
    helpers.sendJSONresponse(res, 200, products);
  }
  catch(e) {
    console.error(e);
  }
}

module.exports.allProducts = async (req, res) => {
  try {
    const products = await Product.find(null, null, {sort: {created : -1}});
    helpers.sendJSONresponse(res, 200, products);
  }
  catch(e) {
    console.error(e);
  }
}

module.exports.productById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    helpers.sendJSONresponse(res, 200, product);
  }
  catch(e) {
    console.log(e);
  }
}

module.exports.createProduct = async (req, res) => {
  let product = new Product({
    name: req.body.name,
    model: JSON.parse(req.body.model),
    engine: req.body.engine,
    year: req.body.year,
    description: req.body.description,
    responsible: req.body.responsible,
    owner: JSON.parse(req.body.owner)
  });
    
  try {
    product = await product.save();
  }
  catch(e) {
    console.log(e);
    return helpers.sendJSONresponse(res, 400, e);
  }

  // Сохранение изображений
  if(req.body.images) 
  {
    // в БД храним только имена файлов
    try {
      let images = await imageHelper.saveImages(product.id, req.body.images);
      product.images = images;
      await product.save();
    }
    catch(e) {
      console.log(e);
      return helpers.sendJSONresponse(res, 400, e);
    }
  }

  helpers.sendJSONresponse(res, 200, product);
}

module.exports.updateProduct = async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.body.id);    
    if(!oldProduct) {
      return helpers.sendJSONresponse(res, 400, "Product not found.");
    }
    
    // Удаление изображений
    if(req.body.deletedImages) {
      let deletedImages = Array.isArray(req.body.deletedImages) ? req.body.deletedImages : new Array(req.body.deletedImages); 
      for(const imageId of deletedImages) {
        const image = await oldProduct.images.find((element, index, array) => {
          return element.id === imageId;
        });
        if(image != null) {
          // удаление файлов
          await imageHelper.deleteImage(image.thumb);
          await imageHelper.deleteImage(image.full);
          
          // удаления изображения из продукта
          oldProduct.images.remove(image._id);
        }
      }
    }

    // Добавление изображений
    if(req.body.images) 
    {
      let sourceImages = Array.isArray(req.body.images) ? req.body.images : new Array(req.body.images); 
      let resultImages = await imageHelper.saveImages(oldProduct.id, sourceImages);
      oldProduct.images = oldProduct.images.concat(resultImages);
    }

    // Обновление продукта
    const product = await Product.findByIdAndUpdate(req.body.id,
      { 
        $set: {
          name: req.body.name,
          model: JSON.parse(req.body.model),
          engine: req.body.engine,
          year: req.body.year,
          description: req.body.description,
          responsible: req.body.responsible,
          //owner: JSON.parse(req.body.owner),
          images: oldProduct.images
        }
      },
      { 
        new: true
      }
    );
  
    helpers.sendJSONresponse(res, 200, product);
  }
  catch(e) {
    console.log(e);
    helpers.sendJSONresponse(res, 400, e);
  }
}

module.exports.deleteProduct = async(req, res) => {
  try {
    const product = await Product.findById(req.body.id);
    if(product == null) {
      helpers.sendJSONresponse(res, 400, "Product not found.");
      return;
    }   
    
    product.images.forEach(async(image) => {
      if(image != null) {
        // удаление файлов
        await imageHelper.deleteImage(image.thumb);
        await imageHelper.deleteImage(image.full);
      }
    });
    await Product.deleteOne({ _id: product._id });
  }
  catch(e) {
    console.log(err);
    helpers.sendJSONresponse(res, 400, err);
  }
  helpers.sendJSONresponse(res, 200, { auth: true, message: 'Product with ID "' + req.body.id + '" successfuly deleted.' });
}

