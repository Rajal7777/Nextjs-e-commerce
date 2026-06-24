import { cn } from "@/lib/utils";

const Price = ({ value, className }: { value: number; className?: string; }) => {
    const fixedPrice = value.toFixed(2);
    console.log("fixed", fixedPrice);

    //get the int/ float from the price
    const [intValue, floatValue] = fixedPrice.split('.');
    
    return (
        <p className={cn('text-2xl', className)}>
            <span className="text-xs align-super">¥</span>
            {intValue}
            <span className="text-xs align-super">.{floatValue}</span>
        </p>
    );
};

export default Price;