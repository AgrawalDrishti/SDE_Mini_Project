const upload_controller = require('../controllers/upload_controller');
const upload_routes = require('express').Router();

upload_routes.post('/docker_image', upload_controller.docker_image_handler);
upload_routes.post('/github_url', upload_controller.github_url_handler);
upload_routes.post('/zip_file', upload_controller.zip_file_handler);

module.exports = upload_routes;