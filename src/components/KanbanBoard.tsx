
import { PlusCircle } from 'lucide-react';
import CaseCard from './CaseCard';
import { Button } from '@/components/ui/button';
import { useCases } from '@/context/CaseContext';

const KanbanBoard = () => {
  const { cases } = useCases();
  
  const newCases = cases.filter(c => c.status === 'new');
  const inProgressCases = cases.filter(c => c.status === 'inprogress');
  const pendingCases = cases.filter(c => c.status === 'pending');
  const completedCases = cases.filter(c => c.status === 'completed');

  const KanbanColumn = ({ title, cases, className }: { title: string, cases: ReturnType<typeof useCases>['cases'], className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-md">{title} <span className="text-muted-foreground ml-1 text-sm">({cases.length})</span></h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="bg-secondary/50 rounded-xl p-4 flex-grow overflow-y-auto max-h-[calc(100vh-240px)]">
        <div className="flex flex-col gap-4">
          {cases.map(caseItem => (
            <CaseCard key={caseItem.id} {...caseItem} />
          ))}
          {cases.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No cases in this status
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full animate-fade-in">
      <KanbanColumn title="New" cases={newCases} />
      <KanbanColumn title="In Progress" cases={inProgressCases} />
      <KanbanColumn title="Pending Approval" cases={pendingCases} />
      <KanbanColumn title="Completed" cases={completedCases} />
    </div>
  );
};

export default KanbanBoard;
