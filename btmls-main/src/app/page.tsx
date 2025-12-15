'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import BrandGrid from './components/BrandGrid';
import { RefreshCw } from 'lucide-react';
import { Brand } from '@/types/brand';

export default function HomePage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push('/auth?mode=login');
      return;
    }

    setUser(session.user);
    fetchBrands();
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('brand_name', { ascending: true });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshBrands = async () => {
    try {
      setRefreshing(true);

      // TODO: Call n8n brand sync webhook
      const webhookUrl = process.env.NEXT_PUBLIC_BRAND_SYNC_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user?.id }),
        });
      }

      // Refresh the brand list
      await fetchBrands();
    } catch (error) {
      console.error('Error refreshing brands:', error);
    } finally {
      setRefreshing(false);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Select a Brand
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a brand to export comment data
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <button
            onClick={handleRefreshBrands}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh to Check for New Brands'}
          </button>
        </div>

        {/* Brand Grid */}
        <BrandGrid brands={brands} />
      </div>
    </div>
  );
}
