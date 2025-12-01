import { Info } from "lucide-react";

interface SmartReviewAnalysisProps {
    themes: string[];
    sentiment: {
        score: number;
        label: string;
    };
}

export default function SmartReviewAnalysis({ themes, sentiment }: SmartReviewAnalysisProps) {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Review Analysis</h3>
            </div>

            <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Key Themes</h4>
                <div className="flex flex-wrap gap-2">
                    {themes.map((theme, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full font-medium"
                        >
                            {theme}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Overall Sentiment</h4>
                <div className="relative h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000 ease-out"
                        style={{ width: `${sentiment.score}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                        {sentiment.label} ({sentiment.score}%)
                    </div>
                </div>
            </div>
        </div>
    );
}
