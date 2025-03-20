
import { useCases } from '@/context/CaseContext';
import { useState } from 'react';
import CaseCard from './CaseCard';
import TableView from './TableView';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';

const ListView = () => {
  const { cases } = useCases();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  return (
    <div className="animate-fade-in">
      <div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          <Button 
            variant={viewMode === 'card' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('card')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Card View
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <LayoutList className="h-4 w-4 mr-2" />
            Table View
          </Button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map(caseItem => (
            <CaseCard key={caseItem.id} {...caseItem} />
          ))}
          
          {cases.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <h3 className="text-lg font-medium text-muted-foreground">No cases found</h3>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      ) : (
        <TableView />
      )}
    </div>
  );
};

export default ListView;
