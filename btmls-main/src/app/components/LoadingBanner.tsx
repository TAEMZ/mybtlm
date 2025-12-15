'use client';

import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LoadingBannerProps {
    onDismiss?: () => void;
}

export default function LoadingBanner({ onDismiss }: LoadingBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) return null;

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                {/* Spinner icon */}
                <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0 mt-0.5" />

                {/* Message */}
                <div className="flex-1">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        <span className="font-semibold">Please note:</span> Your export is loading.
                        You can close this tab if you'd like. When the export is complete, you'll receive
                        an email with the CSV. <span className="font-semibold">Do not run another export
                            or analysis until this one has finished.</span>
                    </p>
                </div>

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
