
import { PlusCircle } from 'lucide-react';
import CaseCard from './CaseCard';
import { Button } from '@/components/ui/button';

// Sample cases data (would come from API in real application)
const sampleCases = [
  {
    id: '1',
    title: 'Regulatory Compliance Review - Q2',
    description: 'Quarterly review of regulatory compliance standards across all departments. Ensure all new regulations are properly implemented.',
    status: 'new' as const,
    owner: 'Jane Smith',
    department: 'Compliance',
    dueDate: 'Aug 15',
    comments: 3,
    attachments: 2,
    tasks: 8,
    completedTasks: 0
  },
  {
    id: '2',
    title: 'AML Risk Assessment Update',
    description: 'Update the Anti-Money Laundering risk assessment framework to account for new digital payment methods.',
    status: 'inprogress' as const,
    owner: 'Michael Chen',
    department: 'Risk',
    dueDate: 'Jul 30',
    comments: 7,
    attachments: 4,
    tasks: 12,
    completedTasks: 5
  },
  {
    id: '3',
    title: 'Client Data Verification Process',
    description: 'Review and optimize the client data verification process to reduce processing time while maintaining accuracy.',
    status: 'inprogress' as const,
    owner: 'Sarah Johnson',
    department: 'Operations',
    dueDate: 'Aug 10',
    comments: 4,
    attachments: 1,
    tasks: 6,
    completedTasks: 4
  },
  {
    id: '4',
    title: 'New Account Opening Compliance',
    description: 'Ensure all new account opening procedures comply with updated KYC regulations.',
    status: 'pending' as const,
    owner: 'David Lee',
    department: 'Compliance',
    dueDate: 'Aug 5',
    comments: 5,
    attachments: 3,
    tasks: 9,
    completedTasks: 9
  },
  {
    id: '5',
    title: 'Quarterly Compliance Training',
    description: 'Prepare and conduct quarterly compliance training for all staff members.',
    status: 'completed' as const,
    owner: 'Emily Wang',
    department: 'Training',
    dueDate: 'Jul 15',
    comments: 6,
    attachments: 8,
    tasks: 7,
    completedTasks: 7
  },
  {
    id: '6',
    title: 'Internal Audit of Lending Practices',
    description: 'Conduct internal audit of lending practices to ensure compliance with updated regulations.',
    status: 'new' as const,
    owner: 'Robert Kim',
    department: 'Audit',
    dueDate: 'Aug 25',
    comments: 2,
    attachments: 0,
    tasks: 10,
    completedTasks: 0
  },
  {
    id: '7',
    title: 'Customer Complaint Review Process',
    description: 'Review and update the process for handling customer complaints related to regulatory issues.',
    status: 'pending' as const,
    owner: 'Olivia Martinez',
    department: 'Customer Service',
    dueDate: 'Aug 12',
    comments: 9,
    attachments: 5,
    tasks: 8,
    completedTasks: 8
  },
  {
    id: '8',
    title: 'Data Privacy Compliance Review',
    description: 'Review current data privacy practices to ensure compliance with latest regulations.',
    status: 'completed' as const,
    owner: 'William Taylor',
    department: 'Legal',
    dueDate: 'Jul 20',
    comments: 4,
    attachments: 6,
    tasks: 14,
    completedTasks: 14
  }
];

const KanbanBoard = () => {
  const newCases = sampleCases.filter(c => c.status === 'new');
  const inProgressCases = sampleCases.filter(c => c.status === 'inprogress');
  const pendingCases = sampleCases.filter(c => c.status === 'pending');
  const completedCases = sampleCases.filter(c => c.status === 'completed');

  const KanbanColumn = ({ title, cases, className }: { title: string, cases: typeof sampleCases, className?: string }) => (
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
