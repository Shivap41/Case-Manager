
import React from 'react';
import { Task, TaskPriority, TaskStatus } from './TaskItem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle, Circle, MessageCircle, Paperclip, User, Clock, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface TaskDetailProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}

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

const TaskDetail: React.FC<TaskDetailProps> = ({ 
  task, 
  open, 
  onOpenChange,
  onStatusChange
}) => {
  const priorityStyles = getPriorityStyles(task.priority);
  const statusIcon = getStatusIcon(task.status);
  
  // Calculate completion percentage based on status
  const getCompletionPercentage = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'inprogress': return 50;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const completionPercentage = getCompletionPercentage(task.status);

  const handleStatusChange = () => {
    if (!onStatusChange) return;
    
    let newStatus: TaskStatus;
    switch (task.status) {
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
    
    onStatusChange(task.id, newStatus);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Header with status and priority */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={handleStatusChange}>
                {statusIcon}
              </div>
              <h2 className="text-lg font-semibold">{task.title}</h2>
            </div>
            <span 
              className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.border}`}
            >
              {priorityStyles.label}
            </span>
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p className="text-sm">{task.description}</p>
          </div>
          
          <Separator className="my-4" />
          
          {/* Task progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
              <span className="text-sm">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          {/* Task details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Assignee</h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{task.assignee}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{task.dueDate}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{task.status}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{task.priority}</span>
              </div>
            </div>
          </div>
          
          {/* Comments and attachments */}
          <div className="flex gap-4 mb-4">
            {task.commentsCount > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Comments</h3>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{task.commentsCount}</span>
                </div>
              </div>
            )}
            
            {task.attachmentsCount > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Attachments</h3>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span>{task.attachmentsCount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="space-x-2">
            <Button 
              variant={task.status === 'completed' ? 'outline' : 'default'}
              onClick={handleStatusChange}
            >
              {task.status === 'pending' ? 'Start Task' : 
               task.status === 'inprogress' ? 'Complete Task' : 
               'Reopen Task'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetail;
