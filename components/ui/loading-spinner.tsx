import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    className?: string
    size?: "sm" | "md" | "lg"
    text?: string
}

export function LoadingSpinner({ className, size = "md", text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    }

    return (
        <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-2 border-current border-t-transparent",
                    sizeClasses[size]
                )}
            />
            {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
    )
}
