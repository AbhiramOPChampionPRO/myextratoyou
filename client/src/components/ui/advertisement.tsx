import { Card } from "@/components/ui/card";

interface AdProps {
  className?: string;
  size?: "banner" | "sidebar" | "small";
}

export function Advertisement({ className = "", size = "sidebar" }: AdProps) {
  const sizeClasses = {
    banner: "w-full h-32 md:h-40",
    sidebar: "w-full h-64 md:h-72",
    small: "w-full h-24 md:h-32"
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full relative">
        <img 
          src="/attached_assets/move_it_courier_1758362799216.png"
          alt="MoveIt Courier - Fast Delivery Service, Free Shipping, Nationwide Service Available 24/7"
          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => window.open('tel:01001001', '_blank')}
          title="Call MoveIt Courier: 01001001"
        />
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
      </div>
    </Card>
  );
}