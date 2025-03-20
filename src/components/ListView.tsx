
import { useState } from 'react';
import CaseCard from './CaseCard';
import TableView from './TableView';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { Case } from '@/context/CaseContext';

interface ListViewProps {
  cases: Case[];
  showFilters?: boolean;
}

const ListView: React.FC<ListViewProps> = ({ cases, showFilters = true }) => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cases</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
            className="p-2"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="p-2"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseData={caseItem} />
          ))}
          {cases.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No cases found matching the current filters.
            </div>
          )}
        </div>
      ) : (
        <TableView cases={cases} />
      )}
    </div>
  );
};

export default ListView;
