
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCases } from '@/context/CaseContext';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import CaseFilters from '@/components/CaseFilters';
import ListView from '@/components/ListView';
import KanbanBoard from '@/components/KanbanBoard';

// Define the filter values type
type FilterValues = {
  status: string[];
  department: string[];
  priority: string[];
  dateRange: { from?: Date; to?: Date };
  search: string;
};

const Index = () => {
  const { cases } = useCases();
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [filters, setFilters] = useState<FilterValues>({
    status: [],
    department: [],
    priority: [],
    dateRange: {},
    search: ''
  });

  // Filter cases based on selected filters
  const filteredCases = cases.filter(caseItem => {
    if (filters.status.length > 0 && !filters.status.includes(caseItem.status)) {
      return false;
    }
    if (filters.department.length > 0 && !filters.department.includes(caseItem.department)) {
      return false;
    }
    if (filters.priority.length > 0 && !filters.priority.includes(caseItem.priority)) {
      return false;
    }
    if (filters.search && !caseItem.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <DashboardStats cases={cases} />
        
        <div className="mt-6">
          <CaseFilters onFilterChange={setFilters} />
        </div>
        
        <Tabs value={activeView} onValueChange={(val) => setActiveView(val as 'list' | 'kanban')} className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-6">
            <ListView cases={filteredCases} />
          </TabsContent>
          <TabsContent value="kanban" className="mt-6">
            <KanbanBoard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
