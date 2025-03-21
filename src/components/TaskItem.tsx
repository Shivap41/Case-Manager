import { Calendar, CheckCircle, Circle, MessageCircle, Paperclip, User } from 'lucide-react';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'inprogress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  commentsCount: number;
  attachmentsCount: number;
  caseId?: string; // Added caseId as an optional property
};

export type TaskItemProps = {
  id?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignee?: string;
  commentsCount?: number;
  attachmentsCount?: number;
  task?: Task;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onClick?: (id: string) => void;
};

const getPriorityStyles = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        label: 'High'
      };
    case 'medium':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        label: 'Medium'
      };
    case 'low':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        label: 'Low'
      };
    default:
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        label: 'Normal'
      };
  }
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'inprogress':
      return <Circle className="h-5 w-5 text-blue-500" />;
    case 'pending':
      return <Circle className="h-5 w-5 text-gray-300" />;
    default:
      return <Circle className="h-5 w-5 text-gray-300" />;
  }
};

const TaskItem = (props: TaskItemProps) => {
  const task = props.task || {} as Task;
  const id = props.id || task.id || '';
  const title = props.title || task.title || '';
  const description = props.description || task.description || '';
  const status = props.status || task.status || 'pending';
  const priority = props.priority || task.priority || 'low';
  const dueDate = props.dueDate || task.dueDate || '';
  const assignee = props.assignee || task.assignee || '';
  const commentsCount = props.commentsCount ?? task.commentsCount ?? 0;
  const attachmentsCount = props.attachmentsCount ?? task.attachmentsCount ?? 0;
  const onStatusChange = props.onStatusChange;
  const onClick = props.onClick;

  const priorityStyles = getPriorityStyles(priority);
  const statusIcon = getStatusIcon(status);

  const handleStatusChange = () => {
    if (!onStatusChange) return;
    
    let newStatus: TaskStatus;
    switch (status) {
      case 'pending':
        newStatus = 'inprogress';
        break;
      case 'inprogress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
    }
    
    onStatusChange(id, newStatus);
  };

  return (
    <div 
      className="glass-card rounded-lg p-4 mb-3 transition-all duration-300"
      onClick={() => onClick && onClick(id)}
    >
      <div className="flex items-start">
        <button 
          className="mt-1 mr-3 flex-shrink-0 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange();
          }}
        >
          {statusIcon}
        </button>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-base mb-1">{title}</h4>
            <span 
              className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.border}`}
            >
              {priorityStyles.label}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{dueDate}</span>
            </div>
            
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{assignee}</span>
            </div>
            
            {commentsCount > 0 && (
              <div className="flex items-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span>{commentsCount}</span>
              </div>
            )}
            
            {attachmentsCount > 0 && (
              <div className="flex items-center">
                <Paperclip className="h-3 w-3 mr-1" />
                <span>{attachmentsCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
