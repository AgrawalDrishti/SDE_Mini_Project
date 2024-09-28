const build_routes = require('express').Router();

const build_controller = require('../controllers/build_controller');
build_routes.get('/test' , build_controller.get_zip_URL);

module.exports = build_routes;