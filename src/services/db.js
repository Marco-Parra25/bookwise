import { supabase } from './supabase';

export const db = {
    /**
     * Fetch profile for the current user
     */
    async getProfile(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
        return data;
    },

    /**
     * Create or update a profile
     */
    async upsertProfile(userId, profileData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get reading history for the current user
     */
    async getReadingHistory(userId) {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('reading_history')
            .select('*')
            .eq('user_id', userId)
            .order('read_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Add a book to reading history
     */
    async addReadingHistory(userId, book, xpGained = 10) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('reading_history')
            .insert({
                user_id: userId,
                book_id: book.id,
                title: book.title,
                author: book.author,
                cover_url: book.imageUrl || book.cover_url,
                xp_gained: xpGained
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
