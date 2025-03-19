
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import KanbanBoard from '@/components/KanbanBoard';
import ListView from '@/components/ListView';
import CaseFilters from '@/components/CaseFilters';
import { FileText, ListFilter, PlusCircle } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState('kanban');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Case Manager</h1>
            <p className="text-muted-foreground">Manage all your compliance cases in one place</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link to="/create-case">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Case
              </Button>
            </Link>
          </div>
        </div>
        
        <DashboardStats />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">My Cases</h2>
          
          <Tabs defaultValue="kanban" className="w-auto" onValueChange={setActiveView}>
            <TabsList className="grid w-[240px] grid-cols-2">
              <TabsTrigger value="kanban" className="flex items-center justify-center">
                <ListFilter className="h-4 w-4 mr-2" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <CaseFilters />
        
        {activeView === 'kanban' ? <KanbanBoard /> : <ListView />}
      </main>
    </div>
  );
};

export default Index;
