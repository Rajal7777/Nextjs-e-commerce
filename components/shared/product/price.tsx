import { cn, formatCurrency } from "@/lib/utils";

const Price = ({ value, className }: { value: number; className?: string; }) => {
    return (
        <p className={cn('text-muted-foreground', className)}>
            {formatCurrency(value)}
        </p>
    );
};

export default Price;