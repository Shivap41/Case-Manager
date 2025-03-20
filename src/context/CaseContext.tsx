import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CaseStatus = 'new' | 'inprogress' | 'pending' | 'completed' | 'rejected';

export type ApprovalLevel = 'firstLevel' | 'secondLevel';

export type DeviationApproval = {
  isRequired: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  approver?: string;
  approvalDate?: string;
  comments?: string;
  escalatedTo?: string;
  escalationDate?: string;
  escalationComments?: string;
  finalDecision?: 'approved' | 'rejected';
  finalDecisionDate?: string;
  finalDecisionComments?: string;
};

export type NormalApproval = {
  isRequired: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  approver?: string;
  approvalDate?: string;
  comments?: string;
  escalatedTo?: string;
  escalationDate?: string;
  escalationComments?: string;
  finalDecision?: 'approved' | 'rejected';
  finalDecisionDate?: string;
  finalDecisionComments?: string;
};

export type Case = {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  owner: string;
  department: string;
  dueDate: string;
  comments: number;
  attachments: number;
  tasks: number;
  completedTasks: number;
  priority: string;
  createdDate: string;
  createdBy: string;
  deviationApproval?: DeviationApproval;
  normalApproval?: NormalApproval;
  pendingApprovalType?: 'normal' | 'deviation';
  currentApprovalLevel?: ApprovalLevel;
};

// Sample initial cases data
const initialCases: Case[] = [
  {
    id: '1',
    title: 'Regulatory Compliance Review - Q2',
    description: 'Quarterly review of regulatory compliance standards across all departments. Ensure all new regulations are properly implemented.',
    status: 'new',
    owner: 'Jane Smith',
    department: 'Compliance',
    dueDate: 'Aug 15',
    comments: 3,
    attachments: 2,
    tasks: 8,
    completedTasks: 0,
    priority: 'Medium',
    createdDate: 'July 25, 2023',
    createdBy: 'Michael Chen',
    deviationApproval: {
      isRequired: true,
      status: 'pending',
      approver: 'David Lee',
      comments: 'This deviation is required due to regulatory changes in Q2 that need immediate attention outside of standard procedures.'
    }
  },
  {
    id: '2',
    title: 'AML Risk Assessment Update',
    description: 'Update the Anti-Money Laundering risk assessment framework to account for new digital payment methods.',
    status: 'inprogress',
    owner: 'Michael Chen',
    department: 'Risk',
    dueDate: 'Jul 30',
    comments: 7,
    attachments: 4,
    tasks: 12,
    completedTasks: 5,
    priority: 'High',
    createdDate: 'July 20, 2023',
    createdBy: 'Jane Smith',
    deviationApproval: {
      isRequired: true,
      status: 'approved',
      approver: 'Emily Wang',
      approvalDate: 'July 22, 2023',
      comments: 'Approved with minor concerns noted.'
    }
  },
  {
    id: '3',
    title: 'Client Data Verification Process',
    description: 'Review and optimize the client data verification process to reduce processing time while maintaining accuracy.',
    status: 'inprogress',
    owner: 'Sarah Johnson',
    department: 'Operations',
    dueDate: 'Aug 10',
    comments: 4,
    attachments: 1,
    tasks: 6,
    completedTasks: 4,
    priority: 'Medium',
    createdDate: 'July 22, 2023',
    createdBy: 'David Lee',
    normalApproval: {
      isRequired: true,
      status: 'pending',
      approver: 'Robert Kim',
      comments: 'Requesting normal closure approval for this case.'
    },
    pendingApprovalType: 'normal',
    currentApprovalLevel: 'firstLevel'
  },
  {
    id: '4',
    title: 'New Account Opening Compliance',
    description: 'Ensure all new account opening procedures comply with updated KYC regulations.',
    status: 'pending',
    owner: 'David Lee',
    department: 'Compliance',
    dueDate: 'Aug 5',
    comments: 5,
    attachments: 3,
    tasks: 9,
    completedTasks: 9,
    priority: 'Medium',
    createdDate: 'July 18, 2023',
    createdBy: 'Emily Wang',
    normalApproval: {
      isRequired: true,
      status: 'escalated',
      approver: 'William Taylor',
      comments: 'Initial review completed, requires higher level approval.',
      escalatedTo: 'Emily Wang',
      escalationDate: 'July 30, 2023',
      escalationComments: 'Escalating due to regulatory implications.'
    },
    pendingApprovalType: 'normal',
    currentApprovalLevel: 'secondLevel'
  },
  {
    id: '5',
    title: 'Quarterly Compliance Training',
    description: 'Prepare and conduct quarterly compliance training for all staff members.',
    status: 'completed',
    owner: 'Emily Wang',
    department: 'Training',
    dueDate: 'Jul 15',
    comments: 6,
    attachments: 8,
    tasks: 7,
    completedTasks: 7,
    priority: 'Low',
    createdDate: 'July 10, 2023',
    createdBy: 'Robert Kim',
    normalApproval: {
      isRequired: true,
      status: 'approved',
      approver: 'Robert Kim',
      approvalDate: 'July 20, 2023',
      comments: 'Approved. All training objectives met satisfactorily.'
    }
  },
  {
    id: '6',
    title: 'Internal Audit of Lending Practices',
    description: 'Conduct internal audit of lending practices to ensure compliance with updated regulations.',
    status: 'new',
    owner: 'Robert Kim',
    department: 'Audit',
    dueDate: 'Aug 25',
    comments: 2,
    attachments: 0,
    tasks: 10,
    completedTasks: 0,
    priority: 'High',
    createdDate: 'July 28, 2023',
    createdBy: 'Olivia Martinez'
  },
  {
    id: '7',
    title: 'Customer Complaint Review Process',
    description: 'Review and update the process for handling customer complaints related to regulatory issues.',
    status: 'pending',
    owner: 'Olivia Martinez',
    department: 'Customer Service',
    dueDate: 'Aug 12',
    comments: 9,
    attachments: 5,
    tasks: 8,
    completedTasks: 8,
    priority: 'Medium',
    createdDate: 'July 15, 2023',
    createdBy: 'William Taylor',
    deviationApproval: {
      isRequired: true,
      status: 'escalated',
      approver: 'Emily Wang',
      comments: 'Requesting deviation approval due to special circumstances.',
      escalatedTo: 'Robert Kim',
      escalationDate: 'July 25, 2023',
      escalationComments: 'Escalating for further review of compliance implications.'
    },
    pendingApprovalType: 'deviation',
    currentApprovalLevel: 'secondLevel'
  },
  {
    id: '8',
    title: 'Data Privacy Compliance Review',
    description: 'Review current data privacy practices to ensure compliance with latest regulations.',
    status: 'completed',
    owner: 'William Taylor',
    department: 'Legal',
    dueDate: 'Jul 20',
    comments: 4,
    attachments: 6,
    tasks: 14,
    completedTasks: 14,
    priority: 'Medium',
    createdDate: 'July 5, 2023',
    createdBy: 'Jane Smith',
    normalApproval: {
      isRequired: true,
      status: 'approved',
      approver: 'Jane Smith',
      approvalDate: 'July 28, 2023',
      comments: 'Approved. All privacy requirements have been met.'
    }
  }
];

type CaseContextType = {
  cases: Case[];
  addCase: (newCase: Omit<Case, 'id'>) => void;
  getCaseById: (id: string) => Case | undefined;
  updateDeviationApproval: (caseId: string, approval: DeviationApproval) => void;
  updateNormalApproval: (caseId: string, approval: NormalApproval) => void;
  requestApproval: (caseId: string, approvalType: 'normal' | 'deviation', approver: string, comments: string) => void;
  processApproval: (
    caseId: string, 
    action: 'approve' | 'reject' | 'escalate', 
    comments: string, 
    escalateTo?: string
  ) => void;
  processFinalApproval: (
    caseId: string, 
    action: 'approve' | 'reject', 
    comments: string
  ) => void;
};

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider = ({ children }: { children: ReactNode }) => {
  const [cases, setCases] = useState<Case[]>(initialCases);

  const addCase = (newCase: Omit<Case, 'id'>) => {
    // Generate a simple ID (in a real app, this would come from a database)
    const id = `${cases.length + 1}`;
    setCases(prevCases => [...prevCases, { ...newCase, id }]);
  };

  const getCaseById = (id: string) => {
    return cases.find(caseItem => caseItem.id === id);
  };

  const updateDeviationApproval = (caseId: string, approval: DeviationApproval) => {
    setCases(prevCases => 
      prevCases.map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, deviationApproval: approval } 
          : caseItem
      )
    );
  };

  const updateNormalApproval = (caseId: string, approval: NormalApproval) => {
    setCases(prevCases => 
      prevCases.map(caseItem => 
        caseItem.id === caseId 
          ? { ...caseItem, normalApproval: approval } 
          : caseItem
      )
    );
  };

  const requestApproval = (caseId: string, approvalType: 'normal' | 'deviation', approver: string, comments: string) => {
    setCases(prevCases => 
      prevCases.map(caseItem => {
        if (caseItem.id === caseId) {
          const newCase = { 
            ...caseItem, 
            status: 'pending' as CaseStatus,
            pendingApprovalType: approvalType,
            currentApprovalLevel: 'firstLevel'
          };
          
          if (approvalType === 'deviation') {
            newCase.deviationApproval = {
              isRequired: true,
              status: 'pending',
              approver: approver,
              comments: comments
            };
          } else {
            newCase.normalApproval = {
              isRequired: true,
              status: 'pending',
              approver: approver,
              comments: comments
            };
          }
          
          return newCase;
        }
        return caseItem;
      })
    );
  };

  const processApproval = (
    caseId: string, 
    action: 'approve' | 'reject' | 'escalate', 
    comments: string, 
    escalateTo?: string
  ) => {
    setCases(prevCases => 
      prevCases.map(caseItem => {
        if (caseItem.id === caseId) {
          const approvalType = caseItem.pendingApprovalType;
          if (!approvalType) return caseItem;
          
          let newCase = { ...caseItem };
          const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          if (approvalType === 'deviation' && caseItem.deviationApproval) {
            const approval = { ...caseItem.deviationApproval };
            
            if (action === 'approve') {
              approval.status = 'approved';
              approval.approvalDate = today;
              approval.comments = comments;
              newCase.status = 'completed';
            } else if (action === 'reject') {
              approval.status = 'rejected';
              approval.approvalDate = today;
              approval.comments = comments;
              newCase.status = 'rejected';
            } else if (action === 'escalate' && escalateTo) {
              approval.status = 'escalated';
              approval.escalatedTo = escalateTo;
              approval.escalationDate = today;
              approval.escalationComments = comments;
              newCase.currentApprovalLevel = 'secondLevel';
            }
            
            newCase.deviationApproval = approval;
          } else if (approvalType === 'normal' && caseItem.normalApproval) {
            const approval = { ...caseItem.normalApproval };
            
            if (action === 'approve') {
              approval.status = 'approved';
              approval.approvalDate = today;
              approval.comments = comments;
              newCase.status = 'completed';
            } else if (action === 'reject') {
              approval.status = 'rejected';
              approval.approvalDate = today;
              approval.comments = comments;
              newCase.status = 'rejected';
            } else if (action === 'escalate' && escalateTo) {
              approval.status = 'escalated';
              approval.escalatedTo = escalateTo;
              approval.escalationDate = today;
              approval.escalationComments = comments;
              newCase.currentApprovalLevel = 'secondLevel';
            }
            
            newCase.normalApproval = approval;
          }
          
          return newCase;
        }
        return caseItem;
      })
    );
  };

  const processFinalApproval = (
    caseId: string, 
    action: 'approve' | 'reject', 
    comments: string
  ) => {
    setCases(prevCases => 
      prevCases.map(caseItem => {
        if (caseItem.id === caseId) {
          const approvalType = caseItem.pendingApprovalType;
          if (!approvalType) return caseItem;
          
          let newCase = { ...caseItem };
          const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          if (approvalType === 'deviation' && caseItem.deviationApproval) {
            const approval = { ...caseItem.deviationApproval };
            
            approval.finalDecision = action === 'approve' ? 'approved' : 'rejected';
            approval.finalDecisionDate = today;
            approval.finalDecisionComments = comments;
            
            newCase.status = action === 'approve' ? 'completed' : 'rejected';
            newCase.deviationApproval = approval;
          } else if (approvalType === 'normal' && caseItem.normalApproval) {
            const approval = { ...caseItem.normalApproval };
            
            approval.finalDecision = action === 'approve' ? 'approved' : 'rejected';
            approval.finalDecisionDate = today;
            approval.finalDecisionComments = comments;
            
            newCase.status = action === 'approve' ? 'completed' : 'rejected';
            newCase.normalApproval = approval;
          }
          
          return newCase;
        }
        return caseItem;
      })
    );
  };

  return (
    <CaseContext.Provider value={{ 
      cases, 
      addCase, 
      getCaseById, 
      updateDeviationApproval,
      updateNormalApproval,
      requestApproval,
      processApproval,
      processFinalApproval
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCases = () => {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
};
