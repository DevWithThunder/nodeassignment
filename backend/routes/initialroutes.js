const express = require('express');
const initRouter = express();
const { getFiles, imageUpload, getOneImage } = require('../controllers/initialcontroller');


initRouter.post("/upload", imageUpload);
initRouter.get("/images", getFiles);
initRouter.get('/getimage/:imagename', getOneImage);

module.exports = initRouter;