
import React from 'react';
import { useCases, Case } from '@/context/CaseContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Inbox, Activity, TrendingUp, Calendar, Users, FileText } from 'lucide-react';
import ListView from '@/components/ListView';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { cases } = useCases();
  const navigate = useNavigate();

  // Calculate statistics
  const totalCases = cases.length;
  const newCases = cases.filter(c => c.status === 'new').length;
  const inProgressCases = cases.filter(c => c.status === 'inprogress').length;
  const pendingCases = cases.filter(c => c.status === 'pending').length;
  const completedCases = cases.filter(c => c.status === 'completed').length;
  
  const newCasesPercent = totalCases ? Math.round((newCases / totalCases) * 100) : 0;
  const inProgressPercent = totalCases ? Math.round((inProgressCases / totalCases) * 100) : 0;
  const pendingPercent = totalCases ? Math.round((pendingCases / totalCases) * 100) : 0;
  const completedPercent = totalCases ? Math.round((completedCases / totalCases) * 100) : 0;

  // Department distribution data
  const departmentData = cases.reduce((acc: {name: string, value: number}[], curr) => {
    const existingDept = acc.find(d => d.name === curr.department);
    if (existingDept) {
      existingDept.value += 1;
    } else {
      acc.push({ name: curr.department, value: 1 });
    }
    return acc;
  }, []);

  // Priority distribution data
  const priorityData = [
    { name: 'High', value: cases.filter(c => c.priority === 'High').length },
    { name: 'Medium', value: cases.filter(c => c.priority === 'Medium').length },
    { name: 'Low', value: cases.filter(c => c.priority === 'Low').length },
  ];

  // Cases over time (mock data - in a real app, you'd use actual timestamps)
  const timeData = [
    { name: 'Jan', cases: 5 },
    { name: 'Feb', cases: 8 },
    { name: 'Mar', cases: 12 },
    { name: 'Apr', cases: 7 },
    { name: 'May', cases: 10 },
    { name: 'Jun', cases: 15 },
    { name: 'Jul', cases: 18 },
  ];

  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Format percentages
  const renderPercentage = (percent: number) => `${percent}%`;

  // Recent cases
  const recentCases = [...cases].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  ).slice(0, 5);

  // Pending approval cases
  const pendingApprovalCases = cases.filter(c => 
    c.status === 'pending' && 
    ((c.deviationApproval && c.deviationApproval.status === 'pending') || 
     (c.normalApproval && c.normalApproval.status === 'pending'))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="space-x-2">
            <span className="text-muted-foreground">Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="overflow-hidden border-b-4 border-b-blue-500 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <div className="rounded-full p-2 bg-blue-100">
                <Inbox className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalCases}</div>
              <Progress value={100} className="h-2 mt-2" />
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
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-muted-foreground">
                  {renderPercentage(newCasesPercent)} of total
                </div>
              </div>
              <Progress value={newCasesPercent} className="h-2 mt-1" />
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
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-muted-foreground">
                  {renderPercentage(inProgressPercent)} of total
                </div>
              </div>
              <Progress value={inProgressPercent} className="h-2 mt-1" />
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
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-muted-foreground">
                  {renderPercentage(completedPercent)} of total
                </div>
              </div>
              <Progress value={completedPercent} className="h-2 mt-1" />
            </CardContent>
          </Card>
        </div>

        {/* Cases by Department & Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cases by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cases by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={priorityData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases over time & Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Cases over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cases" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {pendingApprovalCases.length > 0 ? (
                  pendingApprovalCases.map(caseItem => (
                    <div 
                      key={caseItem.id} 
                      className="p-3 rounded-md border border-border hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/case/${caseItem.id}`)}
                    >
                      <div className="font-medium truncate">{caseItem.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Approval type: {caseItem.pendingApprovalType === 'deviation' ? 'Deviation' : 'Normal'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Level: {caseItem.currentApprovalLevel === 'firstLevel' ? 'First Level' : 'Second Level'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No pending approvals
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Cases */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <ListView cases={recentCases} showFilters={false} />
              </TabsContent>
              <TabsContent value="table">
                <ListView cases={recentCases} showFilters={false} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Activity Summary</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Completion Rate</span>
                  </div>
                  <span className="font-medium">{totalCases ? Math.round((completedCases / totalCases) * 100) : 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Average Resolution Time</span>
                  </div>
                  <span className="font-medium">5.3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>Active Users</span>
                  </div>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <span>Documents Processed</span>
                  </div>
                  <span className="font-medium">42</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Case Resolution</span>
                    <span className="text-sm font-medium">{completedPercent}%</span>
                  </div>
                  <Progress value={completedPercent} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Task Completion</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Approval Efficiency</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Document Processing</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
