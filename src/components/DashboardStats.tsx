
import { ArrowUp, CheckCircle, Clock, FileClock, FileWarning } from 'lucide-react';
import { useState, useEffect } from 'react';

type StatCardProps = {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const StatCard = ({ title, value, change, icon, bgColor, textColor }: StatCardProps) => (
  <div className="glassmorphism rounded-xl p-6 flex flex-col space-y-4 glass-card-hover transition-all duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className={`text-2xl font-semibold mt-1 ${textColor}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center text-xs font-medium">
      <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
      <span className="text-green-500">{change}%</span>
      <span className="text-muted-foreground ml-1">from last month</span>
    </div>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });

  // Animation for counting up
  useEffect(() => {
    const animateValue = (
      start: number,
      end: number,
      duration: number,
      setter: (value: number) => void
    ) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setter(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // Mock data - in a real app this would come from an API
    animateValue(0, 126, 1500, (value) => setStats(prev => ({ ...prev, total: value })));
    animateValue(0, 42, 1800, (value) => setStats(prev => ({ ...prev, active: value })));
    animateValue(0, 18, 2000, (value) => setStats(prev => ({ ...prev, pending: value })));
    animateValue(0, 66, 2200, (value) => setStats(prev => ({ ...prev, completed: value })));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-in">
      <StatCard
        title="Total Cases"
        value={stats.total}
        change={12}
        icon={<FileClock className="h-6 w-6 text-primary" />}
        bgColor="bg-blue-50"
        textColor="text-primary"
      />
      <StatCard
        title="Active Cases"
        value={stats.active}
        change={8}
        icon={<Clock className="h-6 w-6 text-green-600" />}
        bgColor="bg-green-50"
        textColor="text-green-600"
      />
      <StatCard
        title="Pending Approval"
        value={stats.pending}
        change={3}
        icon={<FileWarning className="h-6 w-6 text-orange-600" />}
        bgColor="bg-orange-50"
        textColor="text-orange-600"
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        change={15}
        icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
        bgColor="bg-blue-50"
        textColor="text-blue-600"
      />
    </div>
  );
};

export default DashboardStats;
