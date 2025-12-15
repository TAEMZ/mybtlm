import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    request: NextRequest,
    { params }: { params: { brandId: string } }
) {
    try {
        const { brandId } = params;

        const { data, error } = await supabase
            .from('facebook_campaigns')
            .select('*')
            .eq('brand_id', brandId)
            .order('name', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ campaigns: data || [] });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaigns' },
            { status: 500 }
        );
    }
}
