
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CaseStatus = 'new' | 'inprogress' | 'pending' | 'completed';

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
    completedTasks: 0
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
    completedTasks: 5
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
    completedTasks: 4
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
    completedTasks: 9
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
    completedTasks: 7
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
    completedTasks: 0
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
    completedTasks: 8
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
    completedTasks: 14
  }
];

type CaseContextType = {
  cases: Case[];
  addCase: (newCase: Omit<Case, 'id'>) => void;
  getCaseById: (id: string) => Case | undefined;
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

  return (
    <CaseContext.Provider value={{ cases, addCase, getCaseById }}>
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
