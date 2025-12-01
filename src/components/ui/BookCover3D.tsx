import { cn } from "@/lib/utils";

interface BookCover3DProps {
    coverUrl: string;
    title: string;
    className?: string;
}

export default function BookCover3D({ coverUrl, title, className }: BookCover3DProps) {
    return (
        <div className={cn("relative group perspective-[1500px] w-full max-w-[300px] mx-auto", className)}>
            <div className="relative w-full aspect-[2/3] transition-transform duration-500 ease-out transform-style-3d group-hover:rotate-y-[-15deg] rotate-y-[-10deg]">

                {/* Front Cover */}
                <div
                    className="absolute inset-0 bg-cover bg-center rounded-r-sm shadow-2xl z-10"
                    title={title}
                    aria-label={`Cover of ${title}`}
                    style={{
                        backgroundImage: `url('${coverUrl}')`,
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {/* Lighting effect/Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none rounded-r-sm"></div>

                    {/* Spine crease effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>

                {/* Spine (Left Side) */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-[40px] bg-slate-800 origin-left rotate-y-90"
                    style={{ transform: 'rotateY(-90deg) translateX(-40px)' }}
                >
                    {/* Spine details could go here, but simple dark color works for generic */}
                    <div className="w-full h-full bg-gradient-to-r from-white/10 to-black/30"></div>
                </div>

                {/* Back Cover (Pages/Thickness) */}
                <div
                    className="absolute right-0 top-1 bottom-1 w-[38px] bg-white origin-right rotate-y-90"
                    style={{
                        transform: 'rotateY(90deg) translateZ(0px)',
                        background: 'linear-gradient(to right, #f1f1f1 0%, #e1e1e1 20%, #f1f1f1 40%, #e1e1e1 60%, #f1f1f1 80%, #e1e1e1 100%)'
                    }}
                ></div>

                {/* Shadow */}
                <div className="absolute top-full left-4 right-4 h-8 bg-black/40 blur-xl transform rotate-x-90 translate-y-4 opacity-60 group-hover:opacity-80 transition-opacity"></div>
            </div>
        </div>
    );
}
