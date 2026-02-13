const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

const generateApiKey = () => 'ak_' + crypto.randomBytes(20).toString('hex');

const sampleApis = [
    {
        id: uuidv4(),
        name: 'Remove Background',
        endpoint: 'https://api.remove.bg/v1.0/removebg',
        category: 'Tools',
        description: 'Remove background from any image automatically using AI. Supports PNG, JPG, and WebP formats.',
        method: 'GET',
        parameters: [
            { name: 'url', type: 'string', status: 'required', description: 'Direct URL to the image' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Image background removed successfully' },
            { code: '400', message: 'Bad Request', description: 'Invalid or missing image URL' },
            { code: '429', message: 'Rate Limited', description: 'Too many requests, please slow down' }
        ],
        requiresKey: true,
        apiKey: generateApiKey(),
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'QR Code Generator',
        endpoint: 'https://api.qrserver.com/v1/create-qr-code/',
        category: 'Tools',
        description: 'Generate QR codes from any text or URL. Customize size and color.',
        method: 'GET',
        parameters: [
            { name: 'data', type: 'string', status: 'required', description: 'Text or URL to encode' },
            { name: 'size', type: 'string', status: 'optional', description: 'QR code size (e.g. 200x200)' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'QR code generated' },
            { code: '400', message: 'Bad Request', description: 'Missing data parameter' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'Screenshot Website',
        endpoint: 'https://shot.screenshotapi.net/screenshot',
        category: 'Tools',
        description: 'Capture full-page screenshots of any website.',
        method: 'GET',
        parameters: [
            { name: 'url', type: 'string', status: 'required', description: 'Website URL to capture' },
            { name: 'width', type: 'number', status: 'optional', description: 'Viewport width in pixels' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Screenshot captured' },
            { code: '408', message: 'Timeout', description: 'Website took too long to load' }
        ],
        requiresKey: true,
        apiKey: generateApiKey(),
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'Anime Waifu',
        endpoint: 'https://api.waifu.pics/sfw/waifu',
        category: 'E-photo',
        description: 'Get random anime waifu images. Safe for work, high quality artwork.',
        method: 'GET',
        parameters: [],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Random waifu image returned' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'Random Meme',
        endpoint: 'https://meme-api.com/gimme',
        category: 'E-photo',
        description: 'Fetch random memes from popular subreddits.',
        method: 'GET',
        parameters: [
            { name: 'count', type: 'number', status: 'optional', description: 'Number of memes (max 50)' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Memes returned' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'Truth or Dare',
        endpoint: 'https://api.truthordarebot.xyz/v1/truth',
        category: 'Games',
        description: 'Get random truth or dare questions for party games.',
        method: 'GET',
        parameters: [
            { name: 'rating', type: 'string', status: 'optional', description: 'Rating: pg, pg13, r' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Question returned' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'Trivia Quiz',
        endpoint: 'https://opentdb.com/api.php',
        category: 'Games',
        description: 'Generate random trivia questions across multiple categories.',
        method: 'GET',
        parameters: [
            { name: 'amount', type: 'number', status: 'required', description: 'Number of questions' },
            { name: 'difficulty', type: 'string', status: 'optional', description: 'easy, medium, hard' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Trivia questions returned' },
            { code: '400', message: 'Bad Request', description: 'Invalid amount' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'Weather Info',
        endpoint: 'https://api.openweathermap.org/data/2.5/weather',
        category: 'Information',
        description: 'Get current weather data for any city.',
        method: 'GET',
        parameters: [
            { name: 'q', type: 'string', status: 'required', description: 'City name' },
            { name: 'units', type: 'string', status: 'optional', description: 'metric or imperial' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Weather data returned' },
            { code: '404', message: 'Not Found', description: 'City not found' }
        ],
        requiresKey: true,
        apiKey: generateApiKey(),
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'Islamic Prayer Times',
        endpoint: 'https://api.aladhan.com/v1/timingsByCity',
        category: 'Information',
        description: 'Get accurate Islamic prayer times by city.',
        method: 'GET',
        parameters: [
            { name: 'city', type: 'string', status: 'required', description: 'City name' },
            { name: 'country', type: 'string', status: 'required', description: 'Country name' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Prayer times returned' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'AI Text Generator',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        category: 'ai/text',
        description: 'Generate intelligent text responses using AI models.',
        method: 'POST',
        parameters: [
            { name: 'prompt', type: 'string', status: 'required', description: 'Text prompt for AI' },
            { name: 'model', type: 'string', status: 'optional', description: 'AI model to use' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'AI response generated' },
            { code: '401', message: 'Unauthorized', description: 'Invalid API key' },
            { code: '429', message: 'Rate Limited', description: 'Too many requests' }
        ],
        requiresKey: true,
        apiKey: generateApiKey(),
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'YouTube Downloader',
        endpoint: 'https://api.example.com/ytdl',
        category: 'Downloader',
        description: 'Download YouTube videos in multiple formats and qualities.',
        method: 'GET',
        parameters: [
            { name: 'url', type: 'string', status: 'required', description: 'YouTube video URL' },
            { name: 'format', type: 'string', status: 'optional', description: 'mp4, mp3, webm' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Download link generated' },
            { code: '400', message: 'Bad Request', description: 'Invalid YouTube URL' }
        ],
        requiresKey: true,
        apiKey: generateApiKey(),
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        name: 'TikTok Downloader',
        endpoint: 'https://api.example.com/tiktok',
        category: 'Downloader',
        description: 'Download TikTok videos without watermark.',
        method: 'GET',
        parameters: [
            { name: 'url', type: 'string', status: 'required', description: 'TikTok video URL' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Video download ready' },
            { code: '400', message: 'Bad Request', description: 'Invalid TikTok URL' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'proxy',
        handlerFile: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    // Local Handler Example
    {
        id: uuidv4(),
        name: 'Image AI',
        endpoint: '',
        category: 'ai/image',
        description: 'AI-powered image processing. Supports text-to-image, image-to-image, and file upload transformations using local handler.',
        method: 'GET',
        parameters: [
            { name: 'prompt', type: 'string', status: 'optional', description: 'Text prompt for AI generation' },
            { name: 'image', type: 'string', status: 'optional', description: 'Image URL for transformation' },
            { name: 'file', type: 'file', status: 'optional', description: 'Upload image file for processing' },
            { name: 'style', type: 'string', status: 'optional', description: 'Art style (anime, realistic, etc)' }
        ],
        statusCodes: [
            { code: '200', message: 'Success', description: 'Image processed successfully' },
            { code: '400', message: 'Bad Request', description: 'Missing prompt or image parameter' },
            { code: '501', message: 'Not Implemented', description: 'Handler file not found' }
        ],
        requiresKey: false,
        apiKey: null,
        apiType: 'local',
        handlerFile: 'image-ai',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

const defaultSettings = {
    heroTitle: 'API DapzSYZ',
    heroSubtitle: 'for Bot Integration',
    heroDescription: 'Platform lengkap untuk mengelola, mendokumentasikan, dan menguji API WhatsApp & Telegram Bot kamu.',
    footerText: 'Made with ❤️ by DapzSYZ',
    footerMotto: 'Platform API Documentation untuk Bot WhatsApp & Telegram.',
    socials: {
        whatsapp: { url: 'https://wa.me/628xxx', enabled: true },
        github: { url: 'https://github.com/dapzsyz', enabled: true },
        instagram: { url: 'https://instagram.com/dapzsyz', enabled: true },
    },
};

const sampleApiKeys = [
    {
        id: uuidv4(),
        key: 'ak_' + crypto.randomBytes(24).toString('hex'),
        owner: 'Bot_WhatsApp_A',
        isActive: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: uuidv4(),
        key: 'ak_' + crypto.randomBytes(24).toString('hex'),
        owner: 'Bot_Telegram_B',
        isActive: true,
        createdAt: new Date().toISOString(),
    },
];

db.defaults({
    apis: [],
    apikeys: [],
    settings: defaultSettings,
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
    },
}).write();

db.set('apis', sampleApis).write();
db.set('apikeys', sampleApiKeys).write();
db.set('settings', defaultSettings).write();
db.set('admin', {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
}).write();

console.log(`✅ Database seeded with ${sampleApis.length} APIs (${sampleApis.filter(a => a.apiType === 'local').length} local handlers)`);
console.log('📋 Categories:', [...new Set(sampleApis.map(a => a.category))].join(', '));
console.log(`🔑 API Keys seeded: ${sampleApiKeys.length} keys`);
sampleApiKeys.forEach(k => console.log(`   → ${k.owner}: ${k.key}`));
console.log('⚙️  Settings seeded (hero, footer, socials)');
console.log(`🔑 Admin: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
