import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Crown, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  milestone: number;
  color: string;
  rarity: string;
  unlocked?: boolean;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
}

const rarityConfig = {
  common: { 
    bgColor: "bg-gray-100 dark:bg-gray-800", 
    borderColor: "border-gray-300 dark:border-gray-600",
    icon: Star,
    glow: ""
  },
  rare: { 
    bgColor: "bg-blue-50 dark:bg-blue-900/20", 
    borderColor: "border-blue-300 dark:border-blue-600",
    icon: Trophy,
    glow: "shadow-blue-200 dark:shadow-blue-900/50"
  },
  epic: { 
    bgColor: "bg-purple-50 dark:bg-purple-900/20", 
    borderColor: "border-purple-300 dark:border-purple-600",
    icon: Crown,
    glow: "shadow-purple-200 dark:shadow-purple-900/50"
  },
  legendary: { 
    bgColor: "bg-orange-50 dark:bg-orange-900/20", 
    borderColor: "border-orange-300 dark:border-orange-600",
    icon: Gem,
    glow: "shadow-orange-200 dark:shadow-orange-900/50"
  }
};

const sizeConfig = {
  sm: {
    card: "h-20 w-20",
    icon: "h-4 w-4",
    emoji: "text-lg",
    title: "text-xs",
    description: "text-xs"
  },
  md: {
    card: "h-32 w-32",
    icon: "h-5 w-5",
    emoji: "text-2xl",
    title: "text-sm font-medium",
    description: "text-xs"
  },
  lg: {
    card: "h-40 w-40",
    icon: "h-6 w-6",
    emoji: "text-3xl",
    title: "text-base font-semibold",
    description: "text-sm"
  }
};

export default function AchievementBadge({ 
  achievement, 
  size = "md",
  showProgress = false 
}: AchievementBadgeProps) {
  const rarity = rarityConfig[achievement.rarity as keyof typeof rarityConfig] || rarityConfig.common;
  const sizeClass = sizeConfig[size];
  const RarityIcon = rarity.icon;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105",
        sizeClass.card,
        achievement.unlocked 
          ? cn(rarity.bgColor, rarity.borderColor, "shadow-lg", rarity.glow)
          : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60",
        achievement.unlocked && "hover:shadow-xl"
      )}
    >
      {/* Rarity indicator */}
      <div className="absolute top-1 right-1">
        <RarityIcon 
          className={cn(
            sizeClass.icon,
            achievement.unlocked 
              ? achievement.rarity === 'legendary' ? "text-orange-500" :
                achievement.rarity === 'epic' ? "text-purple-500" :
                achievement.rarity === 'rare' ? "text-blue-500" :
                "text-gray-500"
              : "text-gray-400"
          )} 
        />
      </div>

      {/* New achievement glow effect */}
      {achievement.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}

      <CardContent className="flex flex-col items-center justify-center h-full p-2 text-center">
        {/* Achievement Icon/Emoji */}
        <div className={cn(
          "mb-1",
          sizeClass.emoji,
          achievement.unlocked ? "" : "grayscale"
        )}>
          {achievement.icon}
        </div>

        {/* Achievement Name */}
        <h3 className={cn(
          sizeClass.title,
          "font-medium text-center leading-tight",
          achievement.unlocked 
            ? "text-gray-900 dark:text-gray-100" 
            : "text-gray-500 dark:text-gray-400"
        )}>
          {achievement.name}
        </h3>

        {/* Category Badge */}
        {size !== "sm" && (
          <Badge 
            variant="secondary" 
            className={cn(
              "mt-1 text-xs capitalize",
              achievement.unlocked ? "" : "opacity-60"
            )}
          >
            {achievement.category}
          </Badge>
        )}

        {/* Milestone indicator */}
        {showProgress && size === "lg" && (
          <div className={cn(
            sizeClass.description,
            "mt-1 text-gray-600 dark:text-gray-400"
          )}>
            {achievement.milestone.toLocaleString()}
          </div>
        )}
      </CardContent>

      {/* Unlock animation overlay */}
      {achievement.unlocked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/20 via-transparent to-transparent opacity-0 animate-pulse" />
        </div>
      )}
    </Card>
  );
}