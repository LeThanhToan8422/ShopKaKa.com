"use client";

import { useState, useEffect } from "react";

type ShopKaKaLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  variant?: "text" | "icon" | "combined";
  onClick?: () => void;
};

export default function ShopKaKaLogo({ 
  size = "md", 
  animated = true,
  variant = "combined",
  onClick 
}: ShopKaKaLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
  }, []);

  // Handle click animation
  const handleClick = () => {
    if (onClick) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
      onClick();
    }
  };

  // Size configuration
  const sizeConfig = {
    sm: { textSize: "text-xl", iconSize: "w-8 h-8", container: "gap-2" },
    md: { textSize: "text-2xl", iconSize: "w-10 h-10", container: "gap-2" },
    lg: { textSize: "text-3xl", iconSize: "w-12 h-12", container: "gap-3" },
    xl: { textSize: "text-4xl", iconSize: "w-16 h-16", container: "gap-3" }
  };

  const { textSize, iconSize, container } = sizeConfig[size];

  // Animation classes
  const entranceAnimation = isVisible 
    ? "opacity-100 translate-y-0 scale-100" 
    : "opacity-0 translate-y-4 scale-95";

  // Click animation
  const clickAnimation = isClicked ? "scale-90" : "";

  // Render icon version with enhanced effects
  if (variant === "icon") {
    return (
      <div 
        className={`
          relative inline-flex items-center justify-center
          ${iconSize}
          ${animated ? entranceAnimation : ""}
          transition-all duration-500 ease-out
          cursor-pointer
          ${clickAnimation}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`
          relative flex items-center justify-center
          ${iconSize}
          transition-all duration-300
          ${isHovered ? "scale-110 rotate-12" : "scale-100"}
        `}>
          {/* Enhanced shopping cart icon with multiple gradients and glow effects */}
          <svg 
            viewBox="0 0 24 24" 
            className={`
              absolute inset-0 w-full h-full
              transition-all duration-700
              ${isHovered ? "opacity-100 scale-110" : "opacity-100"}
              drop-shadow-lg
            `}
          >
            <defs>
              {/* Multiple gradients for richer colors */}
              <linearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="50%" stopColor="#F7931E" />
                <stop offset="100%" stopColor="#FFD23F" />
              </linearGradient>
              <linearGradient id="cartGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF8C00" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
              <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4CC9F0" />
                <stop offset="100%" stopColor="#4361EE" />
              </linearGradient>
              <linearGradient id="wheelGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3A0CA3" />
                <stop offset="100%" stopColor="#7209B7" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feFlood floodColor="#FFD23F" floodOpacity="0.8" result="glowColor" />
                <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Cart body with glow effect when hovered */}
            <path 
              d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" 
              fill="url(#cartGradient)" 
              stroke="white" 
              strokeWidth="0.5"
              filter={isHovered ? "url(#glow)" : "none"}
              className={`
                transition-all duration-500
                ${isHovered ? "drop-shadow-2xl" : "drop-shadow-lg"}
              `}
            />
            
            {/* Cart line */}
            <line 
              x1="3" y1="6" x2="21" y2="6" 
              stroke="white" 
              strokeWidth="0.5"
            />
            
            {/* Cart wheels with enhanced animation */}
            <circle 
              cx="8" cy="20" r="1.5" 
              fill="url(#wheelGradient)"
              className={`
                transition-all duration-700
                ${isHovered ? "animate-spin" : ""}
              `}
            />
            <circle 
              cx="17" cy="20" r="1.5" 
              fill="url(#wheelGradient)"
              className={`
                transition-all duration-700
                ${isHovered ? "animate-spin" : ""}
              `}
            />
            
            {/* KaKa text inside cart with enhanced styling */}
            <text 
              x="12" 
              y="13" 
              textAnchor="middle" 
              fill="white" 
              fontSize="5"
              fontWeight="bold"
              className="select-none drop-shadow"
            >
              KaKa
            </text>
          </svg>
          
          {/* Enhanced particle effects */}
          {isHovered && animated && (
            <>
              {/* Sparkle particles */}
              <div className={`
                absolute -top-2 -right-2 w-4 h-4 animate-ping
                transition-all duration-1000
              `}>
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path 
                    d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" 
                    fill="#FFD700" 
                    className="animate-pulse"
                  />
                </svg>
              </div>
              
              <div className={`
                absolute -bottom-1 -left-1 w-3 h-3 animate-bounce
                transition-all duration-700 delay-100
              `}>
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <circle cx="12" cy="12" r="10" fill="#FF6B6B" className="animate-pulse" />
                </svg>
              </div>
              
              <div className={`
                absolute top-0 left-0 w-2 h-2 animate-ping
                transition-all duration-1000 delay-300
              `}>
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <circle cx="12" cy="12" r="8" fill="#4CC9F0" className="animate-pulse" />
                </svg>
              </div>
            </>
          )}
          
          {/* Pulsing ring effect */}
          {isHovered && animated && (
            <div className={`
              absolute inset-0 rounded-full
              border-2 border-yellow-400
              animate-ping opacity-70
            `}></div>
          )}
        </div>
      </div>
    );
  }

  // Render text version with enhanced effects
  if (variant === "text") {
    return (
      <div 
        className={`
          relative inline-flex items-center font-bold cursor-pointer
          ${textSize}
          ${animated ? entranceAnimation : ""}
          transition-all duration-500 ease-out
          ${clickAnimation}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background glow effect container */}
        <div className={`
          absolute inset-0 -z-20
          transition-all duration-700
          ${isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100"}
        `}>
          <div className={`
            absolute inset-0
            bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-amber-400/20
            rounded-2xl blur-xl
          `}></div>
        </div>
        
        {/* Main text with enhanced animations */}
        <span className={`
          relative
          font-extrabold tracking-wide
          transition-all duration-500
          ${isHovered ? "scale-110" : "scale-100"}
          drop-shadow-lg
        `}>
          <span className={`
            bg-clip-text text-transparent
            bg-gradient-to-r from-orange-500 via-yellow-500 to-amber-500
            animate-text-glow
          `}>
            Shop
          </span>
          <span className={`
            relative
            bg-clip-text text-transparent
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
            transition-all duration-500
            ${isHovered ? "scale-110" : "scale-100"}
            delay-75
          `}>
            Ka
          </span>
          <span className={`
            relative
            bg-clip-text text-transparent
            bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
            transition-all duration-500
            ${isHovered ? "scale-110" : "scale-100"}
            delay-150
          `}>
            Ka
          </span>
          
          {/* Enhanced animated underline with gradient and glow */}
          <span className={`
            absolute -bottom-2 left-0 w-full h-1
            bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400
            rounded-full
            transition-all duration-700
            ${isHovered ? "scale-x-100 opacity-100 shadow-lg shadow-yellow-400/50 animate-pulse" : "scale-x-0 opacity-0"}
          `}></span>
        </span>

        {/* Enhanced floating emoji decorations with particle effects */}
        {animated && (
          <>
            {/* Shopping cart emoji with floating animation */}
            <span className={`
              absolute -top-4 -right-4 text-xl
              transition-all duration-700
              ${isHovered ? "translate-y-0 opacity-100 scale-110" : "-translate-y-3 opacity-0 scale-90"}
              ${isVisible ? "animate-float" : ""}
            `}>
              🛒
            </span>
            
            {/* Sparkle emoji with pulsing effect */}
            <span className={`
              absolute -top-3 -left-4 text-lg
              transition-all duration-1000 delay-100
              ${isHovered ? "translate-y-0 opacity-100 scale-125" : "-translate-y-2 opacity-0 scale-75"}
              ${isVisible ? "animate-pulse" : ""}
            `}>
              ✨
            </span>
            
            {/* Star emoji with bouncing effect */}
            <span className={`
              absolute bottom-0 -right-5 text-base
              transition-all duration-1000 delay-200
              ${isHovered ? "translate-y-0 opacity-100 scale-110" : "translate-y-2 opacity-0 scale-90"}
              ${isVisible ? "animate-bounce" : ""}
            `}>
              ⭐
            </span>
            
            {/* Additional sparkle emojis for more visual interest */}
            <span className={`
              absolute top-2 left-0 text-sm
              transition-all duration-1000 delay-500
              ${isHovered ? "translate-y-0 opacity-100 scale-100" : "translate-y-1 opacity-0 scale-50"}
              ${isVisible ? "animate-pulse" : ""}
            `}>
              💫
            </span>
          </>
        )}

        {/* Enhanced shine effect on hover with multiple layers */}
        {isHovered && animated && (
          <>
            <div className={`
              absolute inset-0 -z-10
              bg-gradient-to-r from-transparent via-white/40 to-transparent
              transform -skew-x-12 transition-transform duration-1000
            `}></div>
            <div className={`
              absolute inset-0 -z-20
              bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20
              rounded-full
              animate-pulse
            `}></div>
          </>
        )}
        
        {/* Glow effect when hovered */}
        {isHovered && animated && (
          <div className={`
            absolute inset-0 -z-30
            bg-gradient-to-r from-yellow-400/30 via-transparent to-yellow-400/30
            rounded-full
            blur-xl
            animate-pulse
          `}></div>
        )}
        
        {/* Particle effects that appear on hover */}
        {isHovered && animated && (
          <>
            {/* Floating particles */}
            <div className={`
              absolute -top-6 left-1/4 w-2 h-2
              bg-gradient-to-r from-yellow-400 to-orange-500
              rounded-full
              animate-float
            `}></div>
            <div className={`
              absolute -bottom-4 right-1/3 w-1.5 h-1.5
              bg-gradient-to-r from-blue-400 to-purple-500
              rounded-full
              animate-bounce
            `}></div>
            <div className={`
              absolute top-1/2 -left-6 w-1 h-1
              bg-gradient-to-r from-green-400 to-teal-500
              rounded-full
              animate-ping
            `}></div>
          </>
        )}
        
        {/* Rainbow effect on text when hovered */}
        {isHovered && animated && (
          <div className={`
            absolute inset-0 -z-40
            bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500
            rounded-2xl
            blur-2xl
            opacity-20
            animate-rainbow
          `}></div>
        )}
      </div>
    );
  }

  // Render combined version (default) with maximum effects
  return (
    <div 
      className={`
        relative inline-flex items-center
        ${container}
        ${animated ? entranceAnimation : ""}
        transition-all duration-500 ease-out
        cursor-pointer
        ${clickAnimation}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced icon with all effects */}
      <div className={`
        relative flex items-center justify-center
        ${iconSize}
        transition-all duration-500
        ${isHovered ? "scale-125 -rotate-12" : "scale-100"}
      `}>
        <svg 
          viewBox="0 0 24 24" 
          className={`
            absolute inset-0 w-full h-full
            transition-all duration-700
            ${isHovered ? "opacity-100 scale-125" : "opacity-100"}
            drop-shadow-2xl
          `}
        >
          <defs>
            {/* Enhanced gradients */}
            <linearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#F7931E" />
              <stop offset="100%" stopColor="#FFD23F" />
            </linearGradient>
            <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4CC9F0" />
              <stop offset="100%" stopColor="#4361EE" />
            </linearGradient>
            
            {/* Enhanced glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feFlood floodColor="#FFD23F" floodOpacity="0.9" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Cart body with enhanced glow */}
          <path 
            d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" 
            fill="url(#cartGradient)" 
            stroke="white" 
            strokeWidth="0.5"
            filter={isHovered ? "url(#glow)" : "none"}
            className={`
              transition-all duration-500
              ${isHovered ? "drop-shadow-2xl" : "drop-shadow-xl"}
            `}
          />
          
          {/* Cart line */}
          <line 
            x1="3" y1="6" x2="21" y2="6" 
            stroke="white" 
            strokeWidth="0.5"
          />
          
          {/* Cart wheels with enhanced animation */}
          <circle 
            cx="8" cy="20" r="1.5" 
            fill="url(#wheelGradient)"
            className={`
              transition-all duration-1000
              ${isHovered ? "animate-spin" : ""}
            `}
          />
          <circle 
            cx="17" cy="20" r="1.5" 
            fill="url(#wheelGradient)"
            className={`
              transition-all duration-1000
              ${isHovered ? "animate-spin" : ""}
            `}
          />
        </svg>
        
        {/* Enhanced particle effects */}
        {isHovered && animated && (
          <>
            {/* Sparkle particle */}
            <div className={`
              absolute -top-1 -right-1 w-3 h-3 animate-ping
              transition-all duration-1000
            `}>
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path 
                  d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" 
                  fill="#FFD700" 
                  className="animate-pulse"
                />
              </svg>
            </div>
            
            {/* Pulsing ring effect */}
            <div className={`
              absolute inset-0 rounded-full
              border-2 border-yellow-400
              animate-ping opacity-70
            `}></div>
          </>
        )}
      </div>
      
      {/* Enhanced text with all effects */}
      <span className={`
        relative font-bold
        ${textSize}
        font-extrabold tracking-wide
        transition-all duration-500
        ${isHovered ? "scale-110" : "scale-100"}
        drop-shadow-xl
      `}>
        <span className={`
          bg-clip-text text-transparent
          bg-gradient-to-r from-orange-500 via-yellow-500 to-amber-500
          animate-text-glow
        `}>
          Shop
        </span>
        <span className={`
          relative
          bg-clip-text text-transparent
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          transition-all duration-500
          ${isHovered ? "scale-110" : "scale-100"}
          delay-75
        `}>
          Ka
        </span>
        <span className={`
          relative
          bg-clip-text text-transparent
          bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
          transition-all duration-500
          ${isHovered ? "scale-110" : "scale-100"}
          delay-150
        `}>
          Ka
        </span>
      </span>
      
      {/* Enhanced shine effect with multiple layers */}
      {isHovered && animated && (
        <>
          <div className={`
            absolute inset-0 -z-10
            bg-gradient-to-r from-transparent via-white/50 to-transparent
            transform -skew-x-12 transition-transform duration-1000
          `}></div>
          <div className={`
            absolute inset-0 -z-20
            bg-gradient-to-r from-yellow-400/30 via-transparent to-yellow-400/30
            rounded-2xl
            animate-pulse
          `}></div>
        </>
      )}
      
      {/* Enhanced glow effect */}
      {isHovered && animated && (
        <div className={`
          absolute inset-0 -z-30
          bg-gradient-to-r from-yellow-400/40 via-transparent to-yellow-400/40
          rounded-2xl
          blur-2xl
          animate-pulse
        `}></div>
      )}
      
      {/* Floating particles around the combined logo */}
      {isHovered && animated && (
        <>
          <div className={`
            absolute -top-4 -left-4 w-2 h-2
            bg-gradient-to-r from-pink-400 to-purple-500
            rounded-full
            animate-bounce
          `}></div>
          <div className={`
            absolute -bottom-3 -right-4 w-1.5 h-1.5
            bg-gradient-to-r from-blue-400 to-teal-500
            rounded-full
            animate-float
          `}></div>
          <div className={`
            absolute top-0 -right-6 w-1 h-1
            bg-gradient-to-r from-yellow-400 to-orange-500
            rounded-full
            animate-ping
          `}></div>
        </>
      )}
    </div>
  );
}