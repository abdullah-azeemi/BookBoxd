import { Sparkles } from "lucide-react";

interface AIBookSummaryProps {
    summary: string;
}

export default function AIBookSummary({ summary }: AIBookSummaryProps) {
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Book Summary</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {summary}
            </p>
        </div>
    );
}
