import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const IconBox = () => {
  return (
    <Card>
      <CardContent className="grid md:grid-cols-4 gap-4 p-4">
        <div className="space-y-2">
          <ShoppingBag />
          <p className="text-sm font-bold">Free Shipping</p>
          <p className="text-sm text-muted-foreground">
            Free shipping for order above 10000
          </p>
        </div>

        <div className="space-y-2">
          <DollarSign />
          <p className="text-sm font-bold">Money Back Guarantee</p>
          <p className="text-sm text-muted-foreground">
            Within 30 days for an exchange
          </p>
        </div>

        <div className="space-y-2">
          <WalletCards />
          <p className="text-sm font-bold">Flexible Payment</p>
          <p className="text-sm text-muted-foreground">
            Pay with credit card, PayPal or COD
          </p>
        </div>

        <div className="space-y-2">
          <Headset />
          <p className="text-sm font-bold">24/7 Support</p>
          <p className="text-sm text-muted-foreground">
            We are here to help you anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IconBox;
