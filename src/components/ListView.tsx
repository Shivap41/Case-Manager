
import { useCases } from '@/context/CaseContext';
import CaseCard from './CaseCard';

const ListView = () => {
  const { cases } = useCases();

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map(caseItem => (
          <CaseCard key={caseItem.id} {...caseItem} />
        ))}
      </div>
      
      {cases.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No cases found</h3>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
