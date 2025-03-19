
import { useState } from 'react';
import CaseCard from './CaseCard';

// Sample cases data (same as KanbanBoard)
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

const ListView = () => {
  const [filteredCases, setFilteredCases] = useState(sampleCases);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map(caseItem => (
          <CaseCard key={caseItem.id} {...caseItem} />
        ))}
      </div>
      
      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No cases found</h3>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
