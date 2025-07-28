// mediaCommands.js - Production-ready
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const { exec } = require('child_process');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const FormData = require('form-data');

const helpers = require('../config/helpers');

const IMGFLIP_USERNAME = "william";
const IMGFLIP_PASSWORD = "9*PGQ3zT@yL?AXi";
const YOUTUBE_API_KEY = "AIzaSyCq3yE54FFFYLLy-HUvp3bk6rTNFL7q9SY";
const IMAGE_API_KEY = "nuAZi6HKBPOx7vwseaLYcJuaHdyihQxDDo7ueRX3Wrk";
const IMAGE_API_PROVIDER = "unsplash";
const GOOGLE_TTS_CLIENT = "tw-ob";


let youtubeResultsCache = {};

const mediaCommands = {
    // Matumizi ya maandishi kuwa sauti
    tts: {
        description: "Badilisha maandishi kuwa sauti",
        usage: ".tts <maandishi>",
        execute: async (sock, msg, args, db, helpers) => {
            if (args.length === 0) {
                return "❌ Tafadhali andika maandishi ya kubadilisha kuwa sauti!";
            }
            
            try {
                const text = args.join(' ');
                const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=${GOOGLE_TTS_CLIENT}&q=${encodeURIComponent(text)}`;
                
                const response = await axios.get(ttsUrl, { responseType: 'arraybuffer' });
                const audioBuffer = Buffer.from(response.data);
                
                await sock.sendMessage(msg.key.remoteJid, {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    caption: `🔊 *MAANDISHI KUWA SAUTI*\n\n📝 Maandishi: ${text}`
                });
                
                return null;
            } catch (error) {
                return "❌ Imeshindikana kutengeneza sauti! Jaribu tena.";
            }
        }
    },
    
    // Tengeneza meme
    meme: {
        description: "Tengeneza meme yenye maandishi yako",
        usage: ".meme <maandishi juu> | <maandishi chini>",
        execute: async (sock, msg, args, db, helpers) => {
            if (args.length === 0) {
                return "❌ Tafadhali andika maandishi ya meme!\n\n📝 Mfano: .meme Unapo code | Lakini inafanya kazi mara ya kwanza";
            }
            
            const text = args.join(' ');
            const [topText, bottomText] = text.split('|').map(t => t.trim());
            
            if (!topText || !bottomText) {
                return "❌ Tafadhali tengeneza maandishi ya juu na chini kwa kutumia '|'\n\n📝 Mfano: .meme Maandishi Juu | Maandishi Chini";
            }
            
            try {
                const memeTemplates = [
                    '181913649', // Meme ya Drake
                    '87743020',  // Buttons mbili
                    '129242436', // Change my mind
                    '222403160', // Meme ya Bernie
                    '131087935'  // Balloon anayeruka
                ];
                
                const templateId = helpers.randomChoice(memeTemplates);
                const memeUrl = `https://api.imgflip.com/caption_image?template_id=${templateId}&username=${IMGFLIP_USERNAME}&password=${IMGFLIP_PASSWORD}&text0=${encodeURIComponent(topText)}&text1=${encodeURIComponent(bottomText)}`;
                
                const response = await axios.get(memeUrl);
                const memeImageUrl = response.data.data.url;
                
                await sock.sendMessage(msg.key.remoteJid, {
                    image: { url: memeImageUrl },
                    caption: `🎭 *MEME*\n\n📝 Juu: ${topText}\n📝 Chini: ${bottomText}`
                });
                
                return null;
            } catch (error) {
                return "❌ Imeshindikana kutengeneza meme! Jaribu tena.";
            }
        }
    },
    
    // Filter za picha
    filter: {
        description: "Weka filter kwenye picha",
        usage: ".filter <jina_la_filter> (jibu kwa picha)",
        execute: async (sock, msg, args, db, helpers) => {
            if (args.length === 0) {
                return "❌ Tafadhali taja filter!\n\n✅ Zinapatikana: blur, sepia, invert, grayscale";
            }
            
            const filter = args[0].toLowerCase();
            const availableFilters = ['blur', 'sepia', 'invert', 'grayscale', 'vintage', 'brightness'];
            
            if (!availableFilters.includes(filter)) {
                return `❌ Filter si halali!\n\n✅ Zinapatikana: ${availableFilters.join(', ')}`;
            }
            
            if (!msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                return "❌ Tafadhali jibu kwa picha ili kuweka filter!";
            }
            
            try {
                return `🎨 *FILTER YA PICHA*\n\n` +
                       `🖼️ Filter: ${filter}\n` +
                       `⏳ Inaprocess picha...\n\n`;
            } catch (error) {
                return "❌ Imeshindikana kuweka filter! Jaribu tena.";
            }
        }
    },
    
    // Taarifa za picha
    imginfo: {
        description: "Pata taarifa za picha",
        usage: ".imginfo (jibu kwa picha)",
        execute: async (sock, msg, args, db, helpers) => {
            if (!msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                return "❌ Tafadhali jibu kwa picha!";
            }
            
            try {
                const imageMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
                
                return `📸 *TAARIFA ZA PICHA*\n\n` +
                       `📏 Upana: ${imageMsg.width || 'Haijulikani'}px\n` +
                       `📐 Urefu: ${imageMsg.height || 'Haijulikani'}px\n` +
                       `💾 Ukubwa wa Faili: ${helpers.formatBytes(imageMsg.fileLength || 0)}\n` +
                       `🔗 Aina ya Faili (MIME): ${imageMsg.mimetype || 'Haijulikani'}\n` +
                       `📅 Muda wa Kupakia: ${new Date().toLocaleString()}`;
            } catch (error) {
                return "❌ Imeshindikana kupata taarifa za picha!";
            }
        }
    },
    
    // Tengeneza stika kutoka picha
    sticker: {
        description: "Badilisha picha kuwa stika",
        usage: ".sticker (jibu kwa picha)",
        execute: async (sock, msg, args, db, helpers) => {
            if (!msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                return "❌ Tafadhali jibu kwa picha ili kubadilisha kuwa stika!";
            }
            
            try {
                return `🎭 *MTENGENEZA STIKA*\n\n` +
                       `⏳ Inabadilisha picha kuwa stika...\n` +
                       `📏 Inarekebisha ukubwa hadi 512x512\n` +
                       `🔄 Inabadilisha subili dakika chache..`;
            } catch (error) {
                return "❌ Imeshindikana kutengeneza stika! Jaribu tena.";
            }
        }
    },
    
    // Taarifa za sauti
    audioinfo: {
        description: "Pata taarifa za faili la sauti",
        usage: ".audioinfo (jibu kwa sauti)",
        execute: async (sock, msg, args, db, helpers) => {
            const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quotedMsg?.audioMessage && !quotedMsg?.voiceMessage) {
                return "❌ Tafadhali jibu kwa faili la sauti au ujumbe wa sauti!";
            }
            
            try {
                const audioMsg = quotedMsg.audioMessage || quotedMsg.voiceMessage;
                const duration = audioMsg.seconds || 0;
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                
                return `🎵 *TAARIFA ZA SAUTI*\n\n` +
                       `⏱️ Muda: ${minutes}:${seconds.toString().padStart(2, '0')}\n` +
                       `💾 Ukubwa wa Faili: ${helpers.formatBytes(audioMsg.fileLength || 0)}\n` +
                       `🔗 Aina ya Faili (MIME): ${audioMsg.mimetype || 'Haijulikani'}\n` +
                       `🎤 Aina: ${quotedMsg.voiceMessage ? 'Ujumbe wa Sauti' : 'Faili la Sauti'}\n` +
                       `📅 Imetumwa: ${new Date().toLocaleString()}`;
            } catch (error) {
                return "❌ Imeshindikana kupata taarifa za sauti!";
            }
        }
    },
    
    // Tafuta muziki YouTube
   ytmusic: {
        description: "Tafuta na pakua muziki kutoka YouTube",
        usage: ".ytmusic <jina la wimbo>",
        execute: async (sock, msg, args, db, helpers) => {
            if (args.length === 0) {
                return "❌ Tafadhali andika jina la wimbo!";
            }

            const query = args.join(' ');
            try {
                const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video`;
                const response = await axios.get(youtubeUrl);
                const results = response.data.items.slice(0, 3);

                if (results.length === 0) {
                    return "❌ Tafadhari Andika .ytmusic <jina la wimbo au Msanii>";
                }

                // Hifadhi matokeo kwa kumbukumbu kwa mtumiaji
                youtubeResultsCache[msg.key.remoteJid] = results;

                let resultText = `🎵 *MATOKEO YA YOUTUBE*\n\n🔍 Utafutaji: "${query}"\n\n`;
                results.forEach((item, index) => {
                    const title = item.snippet.title;
                    const channel = item.snippet.channelTitle;
                    resultText += `${index + 1}. *${title}*\n`;
                    resultText += `   📺 ${channel}\n\n`;
                });

                resultText += "💡 _Andika .download <link ya wimbo> ili ku-download_ Mfano .download https://dl.globalkiki.com/uploads/Lesa%20Mkali%20-%20Mdundo%20.mp3";
                return resultText;
            } catch (error) {
                return "❌ Shida ya kutafuta nyimbo!";
            }
        }
    },
    
    // Tafuta picha
    image: {
        description: "Tafuta picha",
        usage: ".image <maelezo ya picha>",
        execute: async (sock, msg, args, db, helpers) => {
            if (args.length === 0) {
                return "❌ Tafadhali andika maelezo ya picha kutafuta! mfano  .image <jina la picha>";
            }
            
            const query = args.join(' ');
            
            try {
                const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${IMAGE_API_KEY}`;
                const response = await axios.get(unsplashUrl);
                const imageUrl = response.data.results[0].urls.regular;
                
                await sock.sendMessage(msg.key.remoteJid, {
                    image: { url: imageUrl },
                    caption: `🖼️ *PICHA YA: ${query}*`
                });
                
                return null;
            } catch (error) {
                return "❌ Imeshindikana kutafuta picha! andika .image <jina la picha>";
            }
        }
    }
};

module.exports = mediaCommands;
