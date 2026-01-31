import { Check } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const VerifiedBadge = ({ size = "md", className = "" }: VerifiedBadgeProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const checkSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div 
      className={`${sizeClasses[size]} bg-[#1DA1F2] rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        clipPath: "polygon(50% 0%, 61% 11%, 75% 7%, 78% 22%, 93% 25%, 89% 39%, 100% 50%, 89% 61%, 93% 75%, 78% 78%, 75% 93%, 61% 89%, 50% 100%, 39% 89%, 25% 93%, 22% 78%, 7% 75%, 11% 61%, 0% 50%, 11% 39%, 7% 25%, 22% 22%, 25% 7%, 39% 11%)"
      }}
      title="Verificado"
    >
      <Check className={`${checkSizes[size]} text-white stroke-[3]`} />
    </div>
  );
};

export default VerifiedBadge;
