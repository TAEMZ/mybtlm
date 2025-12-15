import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id } = body;

        // Trigger n8n brand sync webhook
        const webhookUrl = process.env.NEXT_PUBLIC_BRAND_SYNC_WEBHOOK_URL;

        if (!webhookUrl) {
            return NextResponse.json(
                { error: 'Brand sync webhook URL not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id }),
        });

        if (!response.ok) {
            throw new Error('Failed to trigger brand sync');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Brand sync error:', error);
        return NextResponse.json(
            { error: 'Failed to sync brands' },
            { status: 500 }
        );
    }
}
