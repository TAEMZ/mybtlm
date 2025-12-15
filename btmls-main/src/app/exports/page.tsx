'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PastExportsTable from '../components/PastExportsTable';

export default function ExportsPage() {
    const [exports, setExports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExports();

        // Poll for updates every 10 seconds
        const interval = setInterval(fetchExports, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchExports = async () => {
        try {
            const { data, error } = await supabase
                .from('export_jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExports(data || []);
        } catch (error) {
            console.error('Error fetching exports:', error);
        } finally {
            setLoading(false);
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
                        Past Exports
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and download your export history
                    </p>
                </div>

                {/* Exports Table */}
                <PastExportsTable exports={exports} />
            </div>
        </div>
    );
}
