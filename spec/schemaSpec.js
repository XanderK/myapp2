describe("Schema", () => {
  const CarBrand = require('../api/models/CarBrand');
  const CarModel = require('../api/models/CarModel');
  const User = require('../api/models/User');
  const Product = require('../api/models/Product');

  const mongoose = require('mongoose');
  const config = require('../api/config');

  let productId = null, userId = null;

  beforeAll(async () => {
    const dbUri = 'mongodb://' + config.db.host + '/' + config.db.name;
    if (process.env.NODE_ENV === 'production') {
      dbUri = process.env.MONGOLAB_URI;
    }
    mongoose.connect(dbUri, { autoIndex: false }).catch(err => console.error(err));

    user = new User({
      name: 'Maximus73bc',
      role: 'manager',
      created: Date.now()
    });
    
    product = new Product({
      name: 'Rear glass',
      model: CarModel.findOne(),
      subModel: "LC200",
      year: 2008,
      isPart: true,
      created: Date.now(),
      description: 'Nice glass...',
      owner: user
    });

    await CarModel.findOne().then(carModel => {
      product.model = carModel;
    }).catch(err => {
      console.log(err);
    });
  });

  afterAll(() => {
    mongoose.connection.close().catch(err => console.error(err));
  });

  describe("database operation", () => {
    it("product save and delete", async () => {
      await product.save().then(savedProduct => {
        productId = savedProduct.id;
        userId = savedProduct.owner.id;
        expect(productId).not.toBeNull();
        expect(userId).not.toBeNull();
      }).catch(err => {
        console.log(err);
      });

      await Product.deleteOne({_id: productId}).then(result => {
        expect(result.n).toBe(1);
        expect(result.ok).toBe(1);
        productId = null;
        userId = null;
      }).catch(err => {
        console.log(err);
      });
    });
  })
});