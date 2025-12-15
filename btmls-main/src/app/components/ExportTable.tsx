'use client';

import { useState } from 'react';

type TabType = 'campaigns' | 'adsets' | 'ads';

interface Campaign {
    id: string;
    name: string;
    status: string;
    date_launched: string;
    ad_spend: number;
}

interface AdSet {
    id: string;
    name: string;
    status: string;
    date_launched: string;
    ad_spend: number;
}

interface Ad {
    id: string;
    name: string;
    status: string;
    date_launched: string;
    ad_spend: number;
}

interface ExportTableProps {
    campaigns?: Campaign[];
    adSets?: AdSet[];
    ads?: Ad[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

export default function ExportTable({
    campaigns = [],
    adSets = [],
    ads = [],
    selectedIds,
    onSelectionChange,
}: ExportTableProps) {
    const [activeTab, setActiveTab] = useState<TabType>('campaigns');

    const getCurrentData = () => {
        switch (activeTab) {
            case 'campaigns':
                return campaigns;
            case 'adsets':
                return adSets;
            case 'ads':
                return ads;
        }
    };

    const currentData = getCurrentData();

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = currentData.map((item) => item.id);
            onSelectionChange([...new Set([...selectedIds, ...allIds])]);
        } else {
            const currentIds = currentData.map((item) => item.id);
            onSelectionChange(selectedIds.filter((id) => !currentIds.includes(id)));
        }
    };

    const handleSelectItem = (id: string, checked: boolean) => {
        if (checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
        }
    };

    const isAllSelected = currentData.length > 0 && currentData.every((item) => selectedIds.includes(item.id));
    const isSomeSelected = currentData.some((item) => selectedIds.includes(item.id)) && !isAllSelected;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab('campaigns')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'campaigns'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                            }`}
                    >
                        Campaigns
                    </button>
                    <button
                        onClick={() => setActiveTab('adsets')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'adsets'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                            }`}
                    >
                        Ad Sets
                    </button>
                    <button
                        onClick={() => setActiveTab('ads')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ads'
                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                            }`}
                    >
                        Ads
                    </button>
                </nav>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    ref={(input) => {
                                        if (input) input.indeterminate = isSomeSelected;
                                    }}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date Launched
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Ad Spend
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === 'ACTIVE'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {item.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {new Date(item.date_launched).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                        ${item.ad_spend?.toLocaleString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {currentData.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        No {activeTab} found
                    </p>
                </div>
            )}
        </div>
    );
}
