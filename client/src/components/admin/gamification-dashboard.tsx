import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Target, TrendingUp, Award, Crown } from "lucide-react";
import AchievementBadge from "./achievement-badge";
import { cn } from "@/lib/utils";

interface GamificationData {
  totalAchievements: number;
  unlockedAchievements: number;
  gamificationStats: {
    totalPoints: number;
    level: number;
    experiencePoints: number;
    achievementCount: number;
    streak: number;
  } | null;
  newlyUnlocked: any[];
  achievementsByCategory: Record<string, any[]>;
}

export default function GamificationDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: gamificationData, isLoading, error } = useQuery<GamificationData>({
    queryKey: ["/api/admin/gamification-overview"],
    refetchInterval: 30000, // Refresh every 30 seconds to check for new achievements
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !gamificationData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Unable to load gamification data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { totalAchievements, unlockedAchievements, gamificationStats, newlyUnlocked, achievementsByCategory } = gamificationData;
  const completionPercentage = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;
  
  // Calculate next level progress
  const currentLevel = gamificationStats?.level || 1;
  const currentPoints = gamificationStats?.totalPoints || 0;
  const pointsForCurrentLevel = (currentLevel - 1) * 100;
  const pointsForNextLevel = currentLevel * 100;
  const levelProgress = currentPoints > 0 ? ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100 : 0;

  // Get level badge color
  const getLevelColor = (level: number) => {
    if (level >= 10) return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
    if (level >= 5) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    return "text-green-600 bg-green-100 dark:bg-green-900/20";
  };

  const categories = Object.keys(achievementsByCategory);

  return (
    <div className="space-y-6">
      {/* New achievements notification */}
      {newlyUnlocked && newlyUnlocked.length > 0 && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Award className="h-5 w-5" />
              New Achievements Unlocked! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {newlyUnlocked.map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={{ ...achievement, unlocked: true }}
                  size="sm"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Level</p>
                <p className="text-2xl font-bold">{currentLevel}</p>
              </div>
              <Crown className={cn("h-8 w-8", getLevelColor(currentLevel))} />
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>{currentPoints} pts</span>
                <span>{pointsForNextLevel} pts</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Points</p>
                <p className="text-2xl font-bold">{currentPoints.toLocaleString()}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</p>
                <p className="text-2xl font-bold">{unlockedAchievements}/{totalAchievements}</p>
              </div>
              <Trophy className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4">
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {completionPercentage.toFixed(1)}% Complete
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-2xl font-bold">{gamificationStats?.streak || 0}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Badges
          </CardTitle>
          <CardDescription>
            Track your progress and unlock rewards as you reach important milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.flatMap(category => 
                  achievementsByCategory[category]
                    .sort((a, b) => {
                      // Sort unlocked achievements first, then by milestone
                      if (a.unlocked && !b.unlocked) return -1;
                      if (!a.unlocked && b.unlocked) return 1;
                      return a.milestone - b.milestone;
                    })
                    .map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        size="md"
                        showProgress
                      />
                    ))
                )}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {category}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {achievementsByCategory[category].filter(a => a.unlocked).length} / {achievementsByCategory[category].length} unlocked
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {achievementsByCategory[category]
                      .sort((a, b) => {
                        // Sort unlocked achievements first, then by milestone
                        if (a.unlocked && !b.unlocked) return -1;
                        if (!a.unlocked && b.unlocked) return 1;
                        return a.milestone - b.milestone;
                      })
                      .map((achievement) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          size="lg"
                          showProgress
                        />
                      ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}