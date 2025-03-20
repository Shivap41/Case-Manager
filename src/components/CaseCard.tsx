
import { Clock, FileText, MessageSquare, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Case } from '@/context/CaseContext';

// Update the type definition to match the Case type from context
type CaseStatus = 'new' | 'inprogress' | 'pending' | 'completed' | 'rejected';

interface CaseCardProps {
  caseData: Case;
}

const getStatusStyles = (status: CaseStatus) => {
  switch (status) {
    case 'new':
      return {
        bg: 'bg-case-new',
        text: 'text-case-new-foreground',
        label: 'New'
      };
    case 'inprogress':
      return {
        bg: 'bg-case-inprogress',
        text: 'text-case-inprogress-foreground',
        label: 'In Progress'
      };
    case 'pending':
      return {
        bg: 'bg-case-pending',
        text: 'text-case-pending-foreground',
        label: 'Pending'
      };
    case 'completed':
      return {
        bg: 'bg-case-completed',
        text: 'text-case-completed-foreground',
        label: 'Completed'
      };
    case 'rejected':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rejected'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        label: 'Unknown'
      };
  }
};

const CaseCard = ({ caseData }: CaseCardProps) => {
  const statusStyles = getStatusStyles(caseData.status);
  
  return (
    <Link 
      to={`/case/${caseData.id}`}
      className="glass-card rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full relative overflow-hidden"
    >
      <div 
        className={`absolute top-0 left-0 h-1 w-full ${statusStyles.bg}`}
      ></div>
      
      <div className="flex justify-between items-start mb-4">
        <span 
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles.bg} ${statusStyles.text}`}
        >
          {statusStyles.label}
        </span>
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Due {caseData.dueDate}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-lg mb-2">{caseData.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{caseData.description}</p>
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-3 text-xs text-muted-foreground">
          <span>Owner: {caseData.owner}</span>
          <span>Dept: {caseData.department}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-3 text-xs">
            <div className="flex items-center text-muted-foreground">
              <FileText className="h-3 w-3 mr-1" />
              <span>{caseData.completedTasks}/{caseData.tasks}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{caseData.comments}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Paperclip className="h-3 w-3 mr-1" />
              <span>{caseData.attachments}</span>
            </div>
          </div>
          
          {caseData.status === 'inprogress' && (
            <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(caseData.completedTasks / caseData.tasks) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CaseCard;
