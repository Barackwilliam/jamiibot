// config/sessionStorage.js
const dbInstance = require('./db'); // ndani ya config, hivyo './db' inafaa
const supabase = dbInstance.supabase;

const saveLocks = new Map();

async function upsertSession(sessionId, creds) {
  // prevent concurrent writes for same session
  while (saveLocks.get(sessionId)) {
    await new Promise(r => setTimeout(r, 50));
  }
  saveLocks.set(sessionId, true);
  try {
    await supabase
      .from('whatsapp_sessions')
      .upsert(
        {
          id: sessionId,
          credentials: creds
        },
        { onConflict: 'id' }
      );
  } catch (e) {
    console.error('Failed to upsert session creds:', e.message);
  } finally {
    saveLocks.delete(sessionId);
  }
}

async function fetchSession(sessionId) {
  const { data, error } = await supabase
    .from('whatsapp_sessions')
    .select('credentials')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch session from DB:', error.message);
    return {};
  }
  return data?.credentials || {};
}

/**
 * Retrieves and manages Baileys auth state in Supabase instead of file.
 * @param {string} sessionId
 * @returns {Promise<{state: import('@whiskeysockets/baileys').AuthenticationState, saveCreds: function, clearSession: function}>}
 */
async function useDatabaseAuthState(sessionId) {
  let creds = await fetchSession(sessionId);
  if (!creds || typeof creds !== 'object') creds = {};

  // saveCreds writes current creds object back
  async function saveCreds() {
    try {
      await upsertSession(sessionId, creds);
    } catch (e) {
      console.error('saveCreds error:', e.message);
    }
  }

  // allow external cleanup when logged out
  async function clearSession() {
    try {
      await supabase.from('whatsapp_sessions').delete().eq('id', sessionId);
      creds = {};
    } catch (e) {
      console.error('Failed to clear session from DB:', e.message);
    }
  }

  // Baileys expects state with creds and keys interface
  const state = {
    creds,
    keys: {
      get: async (type, ids) => {
        const store = (creds.keys && creds.keys[type]) || {};
        return ids.reduce((acc, id) => {
          if (store[id]) acc[id] = store[id];
          return acc;
        }, {});
      },
      set: async (data) => {
        creds.keys = creds.keys || {};
        for (const category in data) {
          creds.keys[category] = creds.keys[category] || {};
          Object.assign(creds.keys[category], data[category]);
        }
        await saveCreds();
      },
    },
  };

  return { state, saveCreds, clearSession };
}

module.exports = { useDatabaseAuthState };
