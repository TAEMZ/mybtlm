'use client';

import { ArrowRight } from 'lucide-react';

interface ExportToolbarProps {
    selectedCount: number;
    exportRange: string;
    onExportRangeChange: (range: string) => void;
    onExport: () => void;
    disabled?: boolean;
}

export default function ExportToolbar({
    selectedCount,
    exportRange,
    onExportRangeChange,
    onExport,
    disabled = false,
}: ExportToolbarProps) {
    const isEnabled = selectedCount > 0 && !disabled;

    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            {/* Selection counter */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{selectedCount} Selected</span>
            </div>

            {/* Export controls */}
            <div className="flex items-center gap-3">
                {/* Export range dropdown */}
                <select
                    value={exportRange}
                    onChange={(e) => onExportRangeChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Last 90 Days">Last 90 Days</option>
                    <option value="Last 180 Days">Last 180 Days</option>
                </select>

                {/* Export button */}
                <button
                    onClick={onExport}
                    disabled={!isEnabled}
                    className={`
            flex items-center gap-2 px-6 py-2 rounded-md text-sm transition-all duration-200
            ${isEnabled
                            ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                        }
          `}
                >
                    <span>Run Analysis + Export Data</span>
                    {isEnabled && <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
