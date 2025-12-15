'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Brand } from '@/types/brand';

interface BrandGridProps {
    brands: Brand[];
}

export default function BrandGrid({ brands }: BrandGridProps) {
    console.log("brands", brands)
    const router = useRouter();

    const handleBrandClick = (brandId: string) => {
        router.push(`/brands/${brandId}`);
    };

    return (
        <div className="space-y-6">
            {/* Grid of brand cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                    <button
                        key={brand.id}
                        onClick={() => handleBrandClick(brand.id)}
                        className="group relative bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-6 transition-all duration-200 text-left"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                {brand.logo && (
                                    <img
                                        src={brand.logo}
                                        alt={brand.brand_name}
                                        className="h-8 w-8 mb-3 object-contain"
                                    />
                                )}
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {brand.brand_name}
                                </h3>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Help section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg
                            className="w-6 h-6 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Don't see the brand you need?
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Make sure your admin has granted access to the brand in Facebook Business Manager.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
