import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { brand_id, asset_ids, export_range, user_id } = body;

        // Create export job
        const { data: jobData, error: jobError } = await supabase
            .from('export_jobs')
            .insert({
                brand_id,
                user_id,
                status: 'processing',
                export_range,

            })
            .select()
            .single();

        if (jobError) throw jobError;

        // Trigger n8n export webhook
        const webhookUrl = process.env.NEXT_PUBLIC_EXPORT_WEBHOOK_URL;

        if (!webhookUrl) {
            return NextResponse.json(
                { error: 'Export webhook URL not configured' },
                { status: 500 }
            );
        }

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        const days = export_range === 'Last 30 Days' ? 30 : export_range === 'Last 90 Days' ? 90 : 180;
        startDate.setDate(endDate.getDate() - days);

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                job_id: jobData.id,
                ad_ids: asset_ids, // Workflow expects ad_ids
                export_range,
                date_range: {
                    start: startDate.toISOString().split('T')[0],
                    end: endDate.toISOString().split('T')[0],
                },
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to trigger export');
        }

        return NextResponse.json({
            success: true,
            job_id: jobData.id
        });
    } catch (error) {
        console.error('Export creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create export' },
            { status: 500 }
        );
    }
}
