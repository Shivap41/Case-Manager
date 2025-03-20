
import { useCases, Case } from '@/context/CaseContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, MessageSquare, Paperclip, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusLabels: Record<string, string> = {
  'new': 'New',
  'inprogress': 'In Progress',
  'pending': 'Pending Approval',
  'completed': 'Completed'
};

const statusClasses: Record<string, string> = {
  'new': 'bg-case-new text-case-new-foreground',
  'inprogress': 'bg-case-inprogress text-case-inprogress-foreground',
  'pending': 'bg-case-pending text-case-pending-foreground',
  'completed': 'bg-case-completed text-case-completed-foreground'
};

const TableView = () => {
  const { cases } = useCases();

  return (
    <div className="animate-fade-in">
      <div className="rounded-md border glassmorphism">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="w-[120px]">Due Date</TableHead>
              <TableHead className="w-[120px]">Priority</TableHead>
              <TableHead className="w-[100px]">Tasks</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
              <TableHead className="w-[80px]">Deviation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.id}</TableCell>
                <TableCell>
                  <Link to={`/case/${caseItem.id}`} className="text-primary hover:underline">
                    {caseItem.title}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {caseItem.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge className={statusClasses[caseItem.status]}>
                    {statusLabels[caseItem.status]}
                  </Badge>
                </TableCell>
                <TableCell>{caseItem.owner}</TableCell>
                <TableCell>{caseItem.department}</TableCell>
                <TableCell>{caseItem.dueDate}</TableCell>
                <TableCell>{caseItem.priority}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <span>{caseItem.completedTasks}/{caseItem.tasks}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex space-x-2 text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span>{caseItem.comments}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Paperclip className="h-3 w-3 mr-1" />
                        <span>{caseItem.attachments}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Link to={`/case/${caseItem.id}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                      View
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell>
                  {caseItem.deviationApproval?.isRequired && (
                    <div className="flex flex-col items-center">
                      <Badge className={
                        caseItem.deviationApproval.status === 'pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : caseItem.deviationApproval.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }>
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        {caseItem.deviationApproval.status === 'pending' 
                          ? 'Pending'
                          : caseItem.deviationApproval.status === 'approved'
                          ? 'Approved'
                          : 'Rejected'
                        }
                      </Badge>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {cases.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-muted-foreground">No cases found</h3>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableView;
