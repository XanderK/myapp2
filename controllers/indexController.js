const config = require('../api/config');
const request = require('request');

const renderHomePage = async(req, res) => {
  const viewName = 'index';
  res.render(viewName, {
    title: 'Разборка на Лепешинского в Гомеле',
    activeView: viewName,
    user: req.user,
    products: await getLastProducts(req)
  });
}

module.exports.homePage = (req, res) => {
  renderHomePage(req, res);
}

const doRequest = (options) =>
  new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(err);
      }
    })
  })
    
const getLastProducts = async(req) => {
  const path = '/api/lastProducts';
  let options = {
    url: config.server + path,
    method: "GET",
    headers: {
      'x-access-token': req.session.token
    },
    json: true
  };

  try {
    const body = await doRequest(options);
    const products = [];
    for (let i = 0; i < body.length; i++) {
      let product = body[i];
      products.push(product);
    }
    //console.log(body)
    return products;
  }
  catch(e) {
    console.error(e);
  }

  // request(options, (err, response, body) => {
  //   let products = [];
  //   if (err) {
  //     console.error(err);
  //   }
  //   else if (response.statusCode === 200) {
  //     for (let i = 0; i < body.length; i++) {
  //       let product = body[i];
  //       products.push(product);
  //     }
  //     return products;
  //   }
  //   else {
  //     console.error(response);
  //   }
  // });
}
