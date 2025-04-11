
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Create a skeleton text component for paragraph loading states
function SkeletonText({ 
  lines = 3, 
  className = "",
  animate = true
}: { 
  lines?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4", 
            i === lines - 1 ? "w-4/5" : "w-full",
            animate && "animate-pulse"
          )} 
          style={{ 
            animationDelay: `${i * 100}ms`,
            opacity: 0.9 - (i * 0.1)
          }}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText }
