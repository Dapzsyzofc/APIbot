/**
 * Local Handler: Image AI
 *
 * Boilerplate handler for AI-powered image processing.
 * Supports both query params AND file uploads.
 *
 * Usage:
 *   Text-to-image:  GET /api/gateway/<id>?prompt=your+text
 *   Image-to-image: POST /api/gateway/<id> with file upload + prompt query
 */

const axios = require('axios');

module.exports = async function imageAiHandler(req, res) {
    try {
        const { prompt, image, style } = req.query;
        const uploadedFile = req.file; // from multer

        // Validate input
        if (!prompt && !image && !uploadedFile) {
            return res.status(400).json({
                status: false,
                error: 'Missing parameters',
                message: 'Provide a "prompt", "image" URL, or upload a file.',
                usage: {
                    text_to_image: 'GET /api/gateway/<id>?prompt=a+beautiful+sunset',
                    image_to_image: 'POST /api/gateway/<id> (form-data: file + prompt)',
                    url_to_image: 'GET /api/gateway/<id>?prompt=make+anime&image=https://example.com/photo.jpg',
                },
            });
        }

        // ===== File Upload Processing =====
        if (uploadedFile) {
            // In production: use sharp for local processing, or forward to AI API
            // const sharp = require('sharp');
            // const processed = await sharp(uploadedFile.buffer).grayscale().toBuffer();

            return res.json({
                status: true,
                type: 'file-upload',
                prompt: prompt || 'enhance',
                style: style || 'default',
                file: {
                    name: uploadedFile.originalname,
                    size: uploadedFile.size,
                    mimetype: uploadedFile.mimetype,
                },
                result: {
                    message: 'File received. Connect a real AI processor to transform this image.',
                },
            });
        }

        // ===== Text-to-Image =====
        if (prompt && !image) {
            const placeholderUrl = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(prompt)}`;

            return res.json({
                status: true,
                type: 'text-to-image',
                prompt,
                style: style || 'default',
                result: {
                    url: placeholderUrl,
                    message: 'Placeholder. Connect a real AI API for actual generation.',
                },
            });
        }

        // ===== Image-to-Image (URL) =====
        if (image) {
            return res.json({
                status: true,
                type: 'image-to-image',
                prompt: prompt || 'enhance',
                original: image,
                style: style || 'default',
                result: {
                    url: image,
                    message: 'Placeholder. Connect a real AI image processor for transformation.',
                },
            });
        }

    } catch (error) {
        console.error('[Handler: image-ai] Error:', error.message);
        return res.status(500).json({
            status: false,
            error: 'Handler error',
            message: error.message,
        });
    }
};
