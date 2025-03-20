
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCases, Case } from '@/context/CaseContext';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import CaseFilters from '@/components/CaseFilters';
import ListView from '@/components/ListView';
import KanbanBoard from '@/components/KanbanBoard';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Define the filter values type
type FilterValues = {
  status: string[];
  department: string[];
  priority: string[];
  dateRange: { from?: Date; to?: Date };
  search: string;
};

// Define props interfaces for the components that are missing them
interface DashboardStatsProps {
  cases: Case[];
}

interface CaseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const Index = () => {
  const { cases } = useCases();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [filters, setFilters] = useState<FilterValues>({
    status: [],
    department: [],
    priority: [],
    dateRange: {},
    search: ''
  });

  // Navigate to create case page
  const handleCreateCase = () => {
    navigate('/create-case');
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cases Dashboard</h1>
          <Button onClick={handleCreateCase} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Case
          </Button>
        </div>

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
