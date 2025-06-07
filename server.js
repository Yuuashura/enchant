const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const https = require("https");

const app = express();
const port = 3000;

// Multer untuk menangani file upload di memori
const upload = multer({ storage: multer.memoryStorage() });

// Fungsi remini (sama seperti yang Anda berikan)
async function remini(imageBuffer, mode = "enhance") {
    return new Promise((resolve, reject) => {
        try {
            const supportedModes = ["enhance", "recolor", "dehaze"];
            if (!supportedModes.includes(mode)) mode = "enhance";

            const url = `https://inferenceengine.vyro.ai/${mode}`;
            const formData = new FormData();
            formData.append("model_version", 1);
            formData.append("image", imageBuffer, {
                filename: "enhance_image_body.jpg",
                contentType: "image/jpeg",
            });

            const options = {
                method: "POST",
                headers: {
                    ...formData.getHeaders(),
                    "User-Agent": "okhttp/4.9.3",
                    Connection: "Keep-Alive",
                },
            };

            const req = https.request(url, options, (res) => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`API Error: Status Code ${res.statusCode}`));
                }

                const chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
            });

            req.on("error", (err) => reject(err));
            formData.pipe(req);
        } catch (err) {
            reject(err);
        }
    });
}

// Menyajikan file HTML, CSS, dan JS dari folder 'public'
app.use(express.static("public"));

// Endpoint untuk menerima gambar dan memprosesnya
app.post("/enhance", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No image uploaded.");
    }

    console.log("Processing image...");

    try {
        // Panggil fungsi remini dengan buffer gambar dari upload
        const enhancedImageBuffer = await remini(req.file.buffer);
        
        // Kirim gambar hasil proses kembali ke client
        res.set("Content-Type", "image/jpeg");
        res.send(enhancedImageBuffer);
        console.log("Image processed and sent back.");

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).send("Failed to enhance image. " + error.message);
    }
});

module.exports = app;
