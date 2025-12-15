'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import ExportToolbar from '../../components/ExportToolbar';
import ExportTable from '../../components/ExportTable';
import LoadingBanner from '../../components/LoadingBanner';
import { AlertCircle } from 'lucide-react';

export default function BrandDetailPage() {
    const params = useParams();
    const router = useRouter();
    const brandId = params.brandId as string;

    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [adSets, setAdSets] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [exportRange, setExportRange] = useState('Last 90 Days');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [showLoadingBanner, setShowLoadingBanner] = useState(false);

    useEffect(() => {
        fetchData();
    }, [brandId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch campaigns
            const { data: campaignsData } = await supabase
                .from('facebook_campaigns')
                .select('*')
                .eq('brand_id', brandId);

            // Fetch ad sets
            const { data: adSetsData } = await supabase
                .from('facebook_ad_sets')
                .select('*')
                .eq('brand_id', brandId);

            // Fetch ads
            const { data: adsData } = await supabase
                .from('facebook_ads')
                .select('*')
                .eq('brand_id', brandId);

            setCampaigns(campaignsData || []);
            setAdSets(adSetsData || []);
            setAds(adsData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (selectedIds.length === 0) return;

        try {
            setExporting(true);
            setShowLoadingBanner(true);

            // Convert selected IDs to ad IDs
            // Check if selections are campaigns, ad sets, or ads
            const selectedCampaignIds = selectedIds.filter(id =>
                campaigns.some(c => c.id === id)
            );
            const selectedAdSetIds = selectedIds.filter(id =>
                adSets.some(a => a.id === id)
            );
            const selectedAdIds = selectedIds.filter(id =>
                ads.some(a => a.id === id)
            );

            let finalAdIds: string[] = [...selectedAdIds];

            // If campaigns selected, get all ads for those campaigns
            if (selectedCampaignIds.length > 0) {
                const { data: campaignAds } = await supabase
                    .from('facebook_ads')
                    .select('id')
                    .in('campaign_id', selectedCampaignIds);

                if (campaignAds) {
                    finalAdIds.push(...campaignAds.map(a => a.id));
                }
            }

            // If ad sets selected, get all ads for those ad sets
            if (selectedAdSetIds.length > 0) {
                const { data: adSetAds } = await supabase
                    .from('facebook_ads')
                    .select('id')
                    .in('ad_set_id', selectedAdSetIds);

                if (adSetAds) {
                    finalAdIds.push(...adSetAds.map(a => a.id));
                }
            }

            // Remove duplicates
            finalAdIds = [...new Set(finalAdIds)];

            if (finalAdIds.length === 0) {
                alert('No ads found for the selected items');
                setExporting(false);
                setShowLoadingBanner(false);
                return;
            }

            // Create export job
            const { data: jobData, error: jobError } = await supabase
                .from('export_jobs')
                .insert({
                    brand_id: brandId,
                    status: 'processing',

                })
                .select()
                .single();

            if (jobError) throw jobError;

            // Trigger n8n export webhook with AD IDs
            const webhookUrl = process.env.NEXT_PUBLIC_EXPORT_WEBHOOK_URL;
            if (webhookUrl) {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        job_id: jobData.id,
                        ad_ids: finalAdIds, // Send only ad IDs
                        export_range: exportRange,
                    }),
                });
            }

            // Clear selection
            setSelectedIds([]);
        } catch (error) {
            console.error('Error starting export:', error);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Loading Banner */}
                {showLoadingBanner && (
                    <LoadingBanner onDismiss={() => setShowLoadingBanner(false)} />
                )}

                {/* API Credit Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-yellow-900 dark:text-yellow-100">
                                <span className="font-semibold">Important:</span> Each export consumes API credits.
                                Please select only the assets you need to analyze.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                    selectedCount={selectedIds.length}
                    exportRange={exportRange}
                    onExportRangeChange={setExportRange}
                    onExport={handleExport}
                    disabled={exporting}
                />

                {/* Export Table */}
                <ExportTable
                    campaigns={campaigns}
                    adSets={adSets}
                    ads={ads}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                />
            </div>
        </div>
    );
}
