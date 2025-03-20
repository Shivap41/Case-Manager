
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Case } from '@/context/CaseContext';
import { AlertCircle, CheckCircle, Clock, Inbox } from 'lucide-react';

interface DashboardStatsProps {
  cases: Case[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ cases }) => {
  // Calculate statistics
  const totalCases = cases.length;
  const newCases = cases.filter(c => c.status === 'new').length;
  const inProgressCases = cases.filter(c => c.status === 'inprogress').length;
  const completedCases = cases.filter(c => c.status === 'completed').length;
  
  // Calculate percentage changes (placeholder values - in a real app you'd compare with previous period)
  const newCasesChange = 12.5;
  const inProgressCasesChange = -4.2;
  const completedCasesChange = 8.7;
  const totalCasesChange = 5.3;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-b-4 border-b-blue-500 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          <div className="rounded-full p-2 bg-blue-100">
            <Inbox className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{totalCases}</div>
          <div className="flex items-center mt-1">
            <div className={`text-xs ${totalCasesChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalCasesChange > 0 ? '+' : ''}{totalCasesChange}%
            </div>
            <div className="text-xs text-muted-foreground ml-1">from last month</div>
          </div>
          <div className="w-full h-1 bg-blue-100 mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{width: '100%'}}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-b-4 border-b-green-500 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-white">
          <CardTitle className="text-sm font-medium">New Cases</CardTitle>
          <div className="rounded-full p-2 bg-green-100">
            <AlertCircle className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{newCases}</div>
          <div className="flex items-center mt-1">
            <div className={`text-xs ${newCasesChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {newCasesChange > 0 ? '+' : ''}{newCasesChange}%
            </div>
            <div className="text-xs text-muted-foreground ml-1">from last month</div>
          </div>
          <div className="w-full h-1 bg-green-100 mt-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{width: `${(newCases / totalCases) * 100}%`}}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-b-4 border-b-amber-500 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-white">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <div className="rounded-full p-2 bg-amber-100">
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{inProgressCases}</div>
          <div className="flex items-center mt-1">
            <div className={`text-xs ${inProgressCasesChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {inProgressCasesChange > 0 ? '+' : ''}{inProgressCasesChange}%
            </div>
            <div className="text-xs text-muted-foreground ml-1">from last month</div>
          </div>
          <div className="w-full h-1 bg-amber-100 mt-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full" 
              style={{width: `${(inProgressCases / totalCases) * 100}%`}}
            ></div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-b-4 border-b-purple-500 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-white">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <div className="rounded-full p-2 bg-purple-100">
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{completedCases}</div>
          <div className="flex items-center mt-1">
            <div className={`text-xs ${completedCasesChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {completedCasesChange > 0 ? '+' : ''}{completedCasesChange}%
            </div>
            <div className="text-xs text-muted-foreground ml-1">from last month</div>
          </div>
          <div className="w-full h-1 bg-purple-100 mt-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full" 
              style={{width: `${(completedCases / totalCases) * 100}%`}}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
