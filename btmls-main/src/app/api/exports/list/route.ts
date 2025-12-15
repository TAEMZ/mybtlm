import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        let query = supabase
            .from('export_jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ exports: data || [] });
    } catch (error) {
        console.error('Error fetching exports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch exports' },
            { status: 500 }
        );
    }
}
