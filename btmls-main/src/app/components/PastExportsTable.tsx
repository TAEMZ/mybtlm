'use client';

import { Loader2, CheckCircle, XCircle, Download } from 'lucide-react';

interface ExportJob {
    id: string;
    status: 'processing' | 'complete' | 'failed';
    assets_exported: string[];
    export_range: string;
    date_exported: string;
    csv_url?: string;
    error_message?: string;
}

interface PastExportsTableProps {
    exports: ExportJob[];
}

export default function PastExportsTable({ exports }: PastExportsTableProps) {
    const handleDownload = (csvUrl: string) => {
        window.open(csvUrl, '_blank');
    };

    const getStatusIcon = (status: ExportJob['status']) => {
        switch (status) {
            case 'processing':
                return <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />;
            case 'complete':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
        }
    };

    const getStatusText = (status: ExportJob['status']) => {
        switch (status) {
            case 'processing':
                return 'Processing';
            case 'complete':
                return 'Complete';
            case 'failed':
                return 'Failed';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Assets Exported
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Export Range
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date Exported
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {exports.map((exportJob) => (
                            <tr key={exportJob.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(exportJob.status)}
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {getStatusText(exportJob.status)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {exportJob.assets_exported.join(', ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {exportJob.export_range}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {new Date(exportJob.date_exported).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {exportJob.status === 'complete' && exportJob.csv_url && (
                                        <button
                                            onClick={() => handleDownload(exportJob.csv_url!)}
                                            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download CSV
                                        </button>
                                    )}
                                    {exportJob.status === 'failed' && exportJob.error_message && (
                                        <span className="text-sm text-red-600 dark:text-red-400">
                                            {exportJob.error_message}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {exports.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No exports yet</p>
                </div>
            )}
        </div>
    );
}
