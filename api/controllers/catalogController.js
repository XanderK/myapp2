const Product = require('../models/Product');
//const Image = require('../models/Image');
const helpers = require('../helpers');
const imageHelper = require('../imageHelper');

module.exports.allProducts = (req, res) => {
  Product.find(null, null, {sort: {created : -1}}).then(products => {
    helpers.sendJSONresponse(res, 200, products);
  }).catch(err => {
    console.error(err);
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.productById = (req, res) => {
  Product.findById(req.params.id).then(product => {
    helpers.sendJSONresponse(res, 200, product);
  }).catch(err => {
    console.log(err);
    helpers.sendJSONresponse(res, 400, err);
  });
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

  /*
  product.save((err, product) => {
    if(err) return helpers.sendJSONresponse(res, 400, err);
    helpers.sendJSONresponse(res, 200, product);
  });
  */
}

module.exports.updateProduct = async (req, res) => {
  try {
    // Удаление изображений
    if(req.body.deletedImages) {
      let deletedImages = Array.isArray(req.body.deletedImages) ? req.body.deletedImages : new Array(req.body.deletedImages); 
      deletedImages.forEach(element => {
        deleteImageById(element);
      });
    }
    
    let product = await Product.findById(req.body.id);
    product.name = req.body.name;
    product.model = JSON.parse(req.body.model);
    product.year = req.body.year;
    product.description = req.body.description;
    product.responsible = req.body.responsible;
    product.owner = JSON.parse(req.body.owner);
        
    // Сохранение изображений
    if(req.body.images) 
    {
      // в БД храним только имена файлов
      try {
        let sourceImages = Array.isArray(req.body.images) ? req.body.images : new Array(req.body.images); 
        let resultImages = await imageHelper.saveImages(product.id, sourceImages);
        product.images = product.images.concat(resultImages);
      }
      catch(e) {
        console.log(e);
        return helpers.sendJSONresponse(res, 400, e);
      }
    }
    await product.save();
    helpers.sendJSONresponse(res, 200, product);
  }
  catch(e) {
    console.log(e);
    helpers.sendJSONresponse(res, 400, e);
  }
}

async function deleteImageById(id) {
  // поиск в продукте изображения по Id
  try {
    //let image = await Product.findOne({images : {$elemMatch: { id: imageId }}});
    let product = await Product.findOne({images: {$elemMatch: {_id: id}}});
    if(product != null) {
      //let imageIndex = -1;
      let image = product.images.find((element, index, array) => {
        //imageIndex = index;
        return element.id === id;
      });
      if(image != null) {
        // удаление файлов
        await imageHelper.deleteImage(image.thumb);
        await imageHelper.deleteImage(image.full);
        // удаления из продукта
        // product.images.splice(imageIndex, 1);
        product.images.pull(image._id);
        await product.save();
      }
    }
  }
  catch(e) {
    console.log(e);
  }
}

module.exports.deleteProduct = (req, res) => {
  const productId = req.body.id;
  
  // TODO: Удалить изображения
  
  Product.remove({ _id: productId }, (err) => {
    if(err) {
      console.log(err);
      helpers.sendJSONresponse(res, 400, err);
    }
    helpers.sendJSONresponse(res, 200, { auth: true, message: 'Product with ID "' + req.body.id + '" successfuly deleted.' });
  });
}

