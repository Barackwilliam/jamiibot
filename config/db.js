//config/db.js

const { createClient } = require('@supabase/supabase-js');
const helpers = require('./helpers');


class Database {
    constructor() {
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
            throw new Error('Supabase credentials missing in environment variables');
        }

        this.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY,
            {
                auth: {
                    persistSession: false
                }
            }
        );

        this.initialize().catch(err => {
            console.error('Database initialization failed:', err);
        });
    }

    async initialize() {
      
        await this.ensureAdminUser();
        console.log('✅ Database initialized successfully');
    }

    /*
    async createTables() {
        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id BIGSERIAL PRIMARY KEY,
                jid TEXT UNIQUE NOT NULL,
                number TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE,
                is_banned BOOLEAN DEFAULT FALSE,
                command_count INTEGER DEFAULT 0,
                message_count INTEGER DEFAULT 0,
                first_seen TIMESTAMPTZ DEFAULT NOW(),
                last_seen TIMESTAMPTZ DEFAULT NOW(),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )`,
            `CREATE TABLE IF NOT EXISTS command_logs (
                id BIGSERIAL PRIMARY KEY,
                user_jid TEXT REFERENCES users(jid) ON DELETE SET NULL,
                command TEXT NOT NULL,
                args TEXT,
                timestamp TIMESTAMPTZ DEFAULT NOW(),
                success BOOLEAN DEFAULT TRUE
            )`,
            `CREATE TABLE IF NOT EXISTS groups (
                id BIGSERIAL PRIMARY KEY,
                jid TEXT UNIQUE NOT NULL,
                name TEXT,
                participants TEXT[],
                created_at TIMESTAMPTZ DEFAULT NOW()
            )`
        ];

        for (const tableSql of tables) {
            const { error } = await this.supabase.rpc('sql', { query: tableSql });
            if (error && !error.message.includes('already exists')) {
                console.error('Table creation error:', error.message);
            }
        }
    }
    */

    async ensureAdminUser() {
        try {
            const adminJid = `${process.env.OWNER_NUMBER}@s.whatsapp.net`;
            const { error } = await this.supabase
                .from('users')
                .upsert(
                    {
                        jid: adminJid,
                        number: process.env.OWNER_NUMBER,
                        is_admin: true,
                        last_seen: new Date().toISOString()
                    },
                    { onConflict: 'jid' }
                );
            
            if (error) throw error;
        } catch (error) {
            console.error('Failed to ensure admin user:', error.message);
        }
    }

    async saveUser(jid, data = {}) {
        try {
            const userData = {
                jid,
                number: helpers.extractNumber(jid),
                ...data,
                last_seen: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: result, error } = await this.supabase
                .from('users')
                .upsert(userData, { onConflict: 'jid' })
                .select()
                .single();

            if (error) throw error;
            return result;
        } catch (error) {
            console.error('Error saving user:', error.message);
            throw error;
        }
    }

    async getUser(jid) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('jid', jid)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting user:', error.message);
            return null;
        }
    }

    async getUsers() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*');

            if (error) throw error;
            return data.reduce((acc, user) => ({ ...acc, [user.jid]: user }), {});
        } catch (error) {
            console.error('Error getting users:', error.message);
            return {};
        }
    }

    async getStats() {
        try {
            const [
                { count: totalUsers },
                { count: bannedUsers },
                { count: totalCommands },
                { data: activeUsers }
            ] = await Promise.all([
                this.supabase.from('users').select('*', { count: 'exact', head: true }),
                this.supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_banned', true),
                this.supabase.from('command_logs').select('*', { count: 'exact', head: true }),
                this.supabase
                    .from('users')
                    .select('*')
                    .gte('last_seen', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            ]);

            return {
                totalUsers: totalUsers || 0,
                bannedUsers: bannedUsers || 0,
                totalCommands: totalCommands || 0,
                activeUsers: activeUsers?.length || 0,
                botStartTime: global.botStartTime
            };
        } catch (error) {
            console.error('Error getting stats:', error.message);
            return {
                totalUsers: 0,
                bannedUsers: 0,
                totalCommands: 0,
                activeUsers: 0,
                botStartTime: global.botStartTime
            };
        }
    }

    async logCommand(jid, command, args, success = true) {
        try {
            const { error } = await this.supabase
                .from('command_logs')
                .insert({
                    user_jid: jid,
                    command,
                    args: args.join(' '),
                    success
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error logging command:', error.message);
        }
    }

    async isAdmin(jid) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('is_admin')
                .eq('jid', jid)
                .maybeSingle();

            if (error) throw error;
            return data?.is_admin || false;
        } catch (error) {
            console.error('Error checking admin status:', error.message);
            return false;
        }
    }
}

module.exports = new Database();

