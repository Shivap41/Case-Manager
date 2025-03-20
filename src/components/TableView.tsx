
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ArrowUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { Case } from '@/context/CaseContext';

interface TableViewProps {
  cases: Case[];
}

const TableView: React.FC<TableViewProps> = ({ cases }) => {
  // Format date to display in a more readable format
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr.includes(',')) return dateStr;
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Approval</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((caseItem) => {
            const approvalDetails = caseItem.pendingApprovalType === 'normal' 
              ? caseItem.normalApproval 
              : caseItem.deviationApproval;
            
            return (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">
                  <Link to={`/case/${caseItem.id}`} className="text-primary hover:underline">
                    {caseItem.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`
                      ${caseItem.status === 'new' ? 'bg-case-new text-case-new-foreground' : ''}
                      ${caseItem.status === 'inprogress' ? 'bg-case-inprogress text-case-inprogress-foreground' : ''}
                      ${caseItem.status === 'pending' ? 'bg-case-pending text-case-pending-foreground' : ''}
                      ${caseItem.status === 'completed' ? 'bg-case-completed text-case-completed-foreground' : ''}
                      ${caseItem.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}
                  >
                    {caseItem.status === 'inprogress' 
                      ? 'In Progress' 
                      : caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{caseItem.owner}</TableCell>
                <TableCell>{caseItem.department}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${caseItem.priority === 'High' ? 'border-red-500 text-red-500' : ''}
                      ${caseItem.priority === 'Medium' ? 'border-amber-500 text-amber-500' : ''}
                      ${caseItem.priority === 'Low' ? 'border-green-500 text-green-500' : ''}
                    `}
                  >
                    {caseItem.priority}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(caseItem.dueDate)}</TableCell>
                <TableCell>
                  {approvalDetails ? (
                    <div className="flex items-center">
                      {approvalDetails.status === 'pending' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                      ) : approvalDetails.status === 'approved' || approvalDetails.finalDecision === 'approved' ? (
                        <ShieldCheck className="h-4 w-4 text-green-500 mr-1" />
                      ) : approvalDetails.status === 'escalated' ? (
                        <ArrowUp className="h-4 w-4 text-blue-500 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className="text-xs">
                        {caseItem.pendingApprovalType === 'normal' ? 'Normal' : 'Deviation'} - 
                        {approvalDetails.status === 'pending'
                          ? ' Pending'
                          : approvalDetails.status === 'approved' || approvalDetails.finalDecision === 'approved'
                          ? ' Approved'
                          : approvalDetails.status === 'escalated'
                          ? ' Escalated'
                          : ' Rejected'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {cases.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No cases found matching the current filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
