
import { useState } from 'react';
import CaseCard from './CaseCard';
import TableView from './TableView';
import { Button } from '@/components/ui/button';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { Case } from '@/context/CaseContext';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ListViewProps {
  cases: Case[];
  showFilters?: boolean;
}

const ListView: React.FC<ListViewProps> = ({ cases, showFilters = true }) => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // For card view
  const tableItemsPerPage = 10; // For table view

  const totalPages = Math.ceil(
    cases.length / (viewMode === 'card' ? itemsPerPage : tableItemsPerPage)
  );

  // Get current cases
  const indexOfLastItem = currentPage * (viewMode === 'card' ? itemsPerPage : tableItemsPerPage);
  const indexOfFirstItem = indexOfLastItem - (viewMode === 'card' ? itemsPerPage : tableItemsPerPage);
  const currentCases = cases.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          {currentCases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseData={caseItem} />
          ))}
          {currentCases.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No cases found matching the current filters.
            </div>
          )}
        </div>
      ) : (
        <TableView cases={currentCases} />
      )}

      {/* Pagination */}
      {cases.length > 0 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                // Logic to show current page and nearby pages
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              }).filter(Boolean)}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ListView;
