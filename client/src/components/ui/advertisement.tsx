import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Truck, Leaf, Star } from "lucide-react";

interface AdProps {
  className?: string;
  size?: "banner" | "sidebar" | "small";
  type?: "moveit" | "getgreen";
}

export function Advertisement({ className = "", size = "sidebar", type = "moveit" }: AdProps) {
  const sizeClasses = {
    banner: "w-full h-32 md:h-40",
    sidebar: "w-full h-64 md:h-72",
    small: "w-full h-24 md:h-32"
  };

  const moveItAd = (
    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="h-6 w-6" />
          <h3 className="text-xl font-bold">MoveIt Courier</h3>
        </div>
        <p className="text-sm opacity-90 mb-1">📦 Fast & Reliable Delivery</p>
        <p className="text-sm opacity-90 mb-1">🆓 FREE Shipping Available</p>
        <p className="text-sm opacity-90">🌍 Nationwide Service 24/7</p>
      </div>
      
      <div className="relative z-10">
        <Button 
          onClick={() => window.open('tel:01001001', '_blank')}
          className="bg-white text-blue-800 hover:bg-blue-50 w-full font-bold"
          size="sm"
          data-testid="button-moveit-call"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call: 01001001
        </Button>
      </div>
    </div>
  );

  const getGreenAd = (
    <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 text-white relative overflow-hidden">
      {/* Background plant images */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-2 right-2 text-4xl">🌱</div>
        <div className="absolute top-8 left-4 text-3xl">🌿</div>
        <div className="absolute bottom-4 right-8 text-3xl">🌺</div>
        <div className="absolute bottom-8 left-2 text-2xl">🌸</div>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10 p-4 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-6 w-6" />
            <h3 className="text-xl font-bold">GetGreen Nursery</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🌹</div>
            <p className="text-sm opacity-90">Premium Saplings & Plants</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🌻</div>
            <p className="text-sm opacity-90">Flower Varieties & Seeds</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🏡</div>
            <p className="text-sm opacity-90">Expert Gardening Advice</p>
          </div>
        </div>
        
        <div>
          <Button 
            onClick={() => window.open('tel:9876543210', '_blank')}
            className="bg-white text-green-800 hover:bg-green-50 w-full font-bold"
            size="sm"
            data-testid="button-getgreen-call"
          >
            <Phone className="h-4 w-4 mr-2" />
            Order Now!
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${sizeClasses[size]} ${className}`} data-testid={`ad-${type}`}>
      {type === "moveit" ? moveItAd : getGreenAd}
    </Card>
  );
}