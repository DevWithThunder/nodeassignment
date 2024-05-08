const multer = require("multer");
const path = require("path");
const fs = require('fs');

const imageUpload = async (req, res) => {
    try {
        // Set up multer for file uploads
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "uploads/");
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            },
        });

        const upload = multer({ storage: storage }).single("image");

        upload(req, res, function (err) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    data: "Error while uploading image."
                });
            }
            const currentDate = new Date().toISOString();
            // Write image name and date to text file
            const filter = req.body.filter;
            fs.appendFileSync('imageLog.txt', `${(req?.file?.originalname) ? req?.file?.originalname : 'image.png'} - ${currentDate} - ${filter}\n`, function (err) {
                if (err) {
                    console.error("Error while writing to file:", err);
                }
                console.log("Image log updated successfully.");
            });

            return res.status(201).json({
                status: true,
                data: "Image uploaded successfully."
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            data: "Error while uploading image."
        });
    }
};

const getFiles = async (req, res) => {
    try {
        fs.readFile('imageLog.txt', 'utf8', function (err, data) {
            if (err) {
                console.error("Error while reading file:", err);
                return res.status(500).json({
                    status: false,
                    data: "Error while getting the images"
                });
            }
            // Parse the content and create image objects
            const images = data.split('\n').filter(line => line.trim() !== '').map(line => {
                const [name, uploadDate, filter] = line.split(' - ');
                return { name, uploadDate, filter };
            });

            return res.json({
                status: true,
                data: images
            });
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            status: false,
            data: "Error while getting the images"
        });
    }
};

const getOneImage = async (req, res) => {
    try {
        const imageName = req.params.imagename;
        const imagePath = path.join('uploads/', imageName);
        const image = await fs.promises.readFile(imagePath); // Use fs.promises.readFile instead
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(image);
    } catch (error) {
        console.error('Error sending image:', error);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = {
    imageUpload,
    getFiles,
    getOneImage
}