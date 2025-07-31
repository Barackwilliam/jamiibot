// upstash-session-sync.js
const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Save the contents of a session directory into Upstash Redis hash.
 * Key: session:<sessionId>
 * Field: filename, Value: file content (utf-8)
 */
async function saveSessionToRedis(sessionDir, sessionId) {
  try {
    const sessionKey = `session:${sessionId}`;
    if (!fs.existsSync(sessionDir)) return;
    const files = fs.readdirSync(sessionDir);
    if (files.length === 0) return;

    const toStore = {};
    for (const file of files) {
      const filePath = path.join(sessionDir, file);
      if (!fs.existsSync(filePath)) continue;
      // Read raw content as utf-8 string
      const content = fs.readFileSync(filePath, 'utf-8');
      toStore[file] = content;
    }

    if (Object.keys(toStore).length === 0) return;

    await redis.hset(sessionKey, toStore);
    // optionally: set TTL if you want expiry
    // await redis.expire(sessionKey, 60 * 60 * 24 * 7); // 7 days
  } catch (e) {
    console.error('Upstash saveSessionToRedis error:', e);
  }
}

/**
 * Load session from Redis into local filesystem before initializing auth state.
 */
async function loadSessionFromRedis(sessionDir, sessionId) {
  try {
    const sessionKey = `session:${sessionId}`;
    const entries = await redis.hgetall(sessionKey);
    if (!entries || Object.keys(entries).length === 0) return;

    fs.mkdirSync(sessionDir, { recursive: true });

    for (const [filename, rawContent] of Object.entries(entries)) {
      let fileData = rawContent;
      // Defensive: if it's an object, try to extract string
      if (typeof rawContent === 'object') {
        if (rawContent?.value != null) {
          fileData = rawContent.value;
        } else {
          // fallback: stringify
          fileData = JSON.stringify(rawContent);
        }
      }
      const dest = path.join(sessionDir, filename);
      fs.writeFileSync(dest, fileData, 'utf-8');
    }
  } catch (e) {
    console.error('Upstash loadSessionFromRedis error:', e);
  }
}

module.exports = { saveSessionToRedis, loadSessionFromRedis };
