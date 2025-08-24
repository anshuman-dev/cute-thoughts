import { Card } from '@/components/ui/card';
import { MessageCircle, Gift, Users, TrendingUp } from 'lucide-react';
import { useCuteThoughtsContract } from '@/lib/contract';

export function StatsSection() {
  const { totalThoughts, totalTips, contractBalance, totalThoughtsAvailable } = useCuteThoughtsContract();

  const stats = [
    {
      icon: MessageCircle,
      value: totalThoughts,
      label: "Total Thoughts",
      bgGradient: "from-pink-50 to-purple-50",
      iconGradient: "from-cute-pink to-cute-lavender",
      testId: "stat-total-thoughts"
    },
    {
      icon: Gift,
      value: parseFloat(totalTips).toFixed(3),
      label: "ETH in Tips",
      bgGradient: "from-yellow-50 to-orange-50",
      iconGradient: "from-cute-yellow to-orange-400",
      testId: "stat-total-tips"
    },
    {
      icon: Users,
      value: Math.floor(totalThoughts / 3) || 1, // Rough estimate of unique users
      label: "Happy Users",
      bgGradient: "from-cyan-50 to-blue-50",
      iconGradient: "from-cute-mint to-cyan-400",
      testId: "stat-unique-users"
    }
  ];

  return (
    <section className="mb-12">
      <Card className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
        <h3 className="text-2xl font-bold text-cute-gray mb-6 text-center" data-testid="stats-title">
          Community Stats
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-4 bg-gradient-to-br ${stat.bgGradient} rounded-xl`}
              data-testid={stat.testId}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.iconGradient} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-cute-gray" data-testid={`${stat.testId}-value`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
