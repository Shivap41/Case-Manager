import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import TaskItem from '@/components/TaskItem';
import DocumentAttachment from '@/components/DocumentAttachment';
import CommentSection from '@/components/CommentSection';
import { AlertCircle, Calendar, ChevronLeft, Clock, MessageSquare, Paperclip, Plus, User, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useCases, Case, DeviationApproval } from '@/context/CaseContext';

type TaskStatus = 'pending' | 'inprogress' | 'completed';

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
  commentsCount: number;
  attachmentsCount: number;
};

type TaskFormValues = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
};

type DeviationApprovalFormValues = {
  status: 'approved' | 'rejected';
  comments: string;
};

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Review Updated Compliance Documentation',
    description: 'Review all documentation to ensure it aligns with the new regulatory requirements.',
    status: 'pending',
    priority: 'high',
    dueDate: 'Aug 10, 2023',
    assignee: 'Jane Smith',
    commentsCount: 2,
    attachmentsCount: 1
  },
  {
    id: '2',
    title: 'Collect Data from All Departments',
    description: 'Gather required information from Risk, Compliance, and Operations teams.',
    status: 'inprogress',
    priority: 'medium',
    dueDate: 'Aug 12, 2023',
    assignee: 'Michael Chen',
    commentsCount: 3,
    attachmentsCount: 0
  },
  {
    id: '3',
    title: 'Verify Internal Controls Adherence',
    description: 'Check that all internal controls are being followed as per the updated regulations.',
    status: 'completed',
    priority: 'medium',
    dueDate: 'Aug 8, 2023',
    assignee: 'Sarah Johnson',
    commentsCount: 1,
    attachmentsCount: 2
  },
  {
    id: '4',
    title: 'Prepare Final Compliance Report',
    description: 'Draft the final compliance report summarizing findings and action items.',
    status: 'pending',
    priority: 'high',
    dueDate: 'Aug 15, 2023',
    assignee: 'David Lee',
    commentsCount: 0,
    attachmentsCount: 0
  }
];

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCaseById, updateDeviationApproval } = useCases();
  const caseDetails = getCaseById(id || '') || {
    id: id || '1',
    title: 'Case Not Found',
    description: 'The requested case could not be found.',
    status: 'inprogress' as const,
    owner: 'Unknown',
    department: 'Unknown',
    dueDate: 'Unknown',
    comments: 0,
    attachments: 0,
    tasks: 0,
    completedTasks: 0,
    priority: 'Medium',
    createdDate: 'Unknown',
    createdBy: 'Unknown'
  };
  
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeTab, setActiveTab] = useState('details');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCloseCaseOpen, setIsCloseCaseOpen] = useState(false);
  const [isDeviationDialogOpen, setIsDeviationDialogOpen] = useState(false);

  const taskForm = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: ''
    }
  });

  const deviationForm = useForm<DeviationApprovalFormValues>({
    defaultValues: {
      status: 'approved',
      comments: ''
    }
  });

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus } 
          : task
      )
    );
    
    toast.success(`Task status updated to ${newStatus}`);
  };

  const handleCreateTask = (data: TaskFormValues) => {
    const newTaskId = `task-${Date.now()}`;
    
    const newTask: Task = {
      id: newTaskId,
      title: data.title,
      description: data.description,
      status: 'pending',
      priority: data.priority,
      dueDate: data.dueDate || 'Not set',
      assignee: data.assignee || 'Unassigned',
      commentsCount: 0,
      attachmentsCount: 0
    };
    
    setTasks([...tasks, newTask]);
    
    setIsCreateTaskOpen(false);
    taskForm.reset();
    toast.success('Task created successfully');
  };

  const handleCloseCase = () => {
    toast.success('Case closed successfully');
    setIsCloseCaseOpen(false);
    setTimeout(() => navigate('/'), 1500);
  };

  const handleDeviationApproval = (data: DeviationApprovalFormValues) => {
    if (!id) return;

    const approval: DeviationApproval = {
      isRequired: true,
      status: data.status,
      approver: 'Current User',
      approvalDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      comments: data.comments
    };

    updateDeviationApproval(id, approval);
    setIsDeviationDialogOpen(false);
    toast.success(`Deviation ${data.status === 'approved' ? 'approved' : 'rejected'} successfully`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex-grow">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold">{caseDetails.title}</h1>
              <span 
                className={`ml-4 text-xs px-2.5 py-1 rounded-full 
                  ${caseDetails.status === 'inprogress' 
                    ? 'bg-case-inprogress text-case-inprogress-foreground' 
                    : caseDetails.status === 'new'
                    ? 'bg-case-new text-case-new-foreground'
                    : caseDetails.status === 'pending'
                    ? 'bg-case-pending text-case-pending-foreground'
                    : 'bg-case-completed text-case-completed-foreground'}`}
              >
                {caseDetails.status === 'inprogress' 
                  ? 'In Progress' 
                  : caseDetails.status === 'new'
                  ? 'New'
                  : caseDetails.status === 'pending'
                  ? 'Pending'
                  : 'Completed'}
              </span>
              
              {caseDetails.deviationApproval?.isRequired && (
                <span 
                  className={`ml-2 text-xs px-2.5 py-1 rounded-full flex items-center
                    ${caseDetails.deviationApproval.status === 'pending' 
                      ? 'bg-amber-100 text-amber-800' 
                      : caseDetails.deviationApproval.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'}`}
                >
                  {caseDetails.deviationApproval.status === 'pending' 
                    ? <AlertTriangle className="h-3 w-3 mr-1" />
                    : caseDetails.deviationApproval.status === 'approved'
                    ? <ShieldCheck className="h-3 w-3 mr-1" />
                    : <AlertCircle className="h-3 w-3 mr-1" />}
                  {caseDetails.deviationApproval.status === 'pending' 
                    ? 'Approval Pending' 
                    : caseDetails.deviationApproval.status === 'approved'
                    ? 'Approved'
                    : 'Rejected'}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1">Case #{caseDetails.id}</p>
          </div>
          
          <Dialog open={isCloseCaseOpen} onOpenChange={setIsCloseCaseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Close Case
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Close this case?</DialogTitle>
              </DialogHeader>
              <p className="py-4">
                Are you sure you want to close this case? This action will mark the case as complete and notify all relevant stakeholders.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCloseCase} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {caseDetails.deviationApproval?.isRequired && 
           caseDetails.deviationApproval.status === 'pending' && (
            <Dialog open={isDeviationDialogOpen} onOpenChange={setIsDeviationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Review Deviation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review Deviation Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={deviationForm.handleSubmit(handleDeviationApproval)} className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    This case requires deviation approval due to its regulatory significance. Please review the details and provide your approval decision.
                  </p>
                  
                  <FormField
                    control={deviationForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decision</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select decision" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="approved">Approve Deviation</SelectItem>
                            <SelectItem value="rejected">Reject Deviation</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={deviationForm.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add comments or justification for your decision" 
                            {...field} 
                            rows={3} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Submit Decision</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          
          <Button>
            Edit Case
          </Button>
        </div>
        
        <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Case Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            {caseDetails.deviationApproval?.isRequired && (
              <TabsTrigger value="deviation">Deviation</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details" className="animate-fade-in">
            <div className="glassmorphism rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4">Case Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm">{caseDetails.description}</p>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Department</h3>
                      <p className="text-sm">{caseDetails.department}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                      <p className="text-sm">{caseDetails.priority}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Case Owner</h3>
                      <p className="text-sm">{caseDetails.owner}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Created On</h3>
                      <p className="text-sm">{caseDetails.createdDate} by {caseDetails.createdBy}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Due Date</h3>
                      <p className="text-sm">{caseDetails.dueDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Comments</h3>
                      <p className="text-sm">3 comments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Paperclip className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium">Attachments</h3>
                      <p className="text-sm">3 files</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800">Attention Required</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    This case has 2 high priority tasks that need to be completed before the due date.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Tasks</h2>
              
              <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={taskForm.handleSubmit(handleCreateTask)} className="space-y-4 pt-4">
                    <FormField
                      control={taskForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter task title" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={taskForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter task description" {...field} rows={3} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={taskForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={taskForm.control}
                        name="assignee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignee</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                                <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                                <SelectItem value="David Lee">David Lee</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={taskForm.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Create Task</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="glassmorphism rounded-xl p-6">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id}
                  {...task}
                  onStatusChange={handleTaskStatusChange}
                />
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks have been created for this case yet.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="animate-fade-in">
            <div className="glassmorphism rounded-xl p-6">
              <DocumentAttachment />
            </div>
          </TabsContent>
          
          <TabsContent value="comments" className="animate-fade-in">
            <div className="glassmorphism rounded-xl p-6">
              <CommentSection />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <div className="glassmorphism rounded-xl p-6">
              <h2 className="text-xl font-medium mb-4">Case History</h2>
              
              <div className="relative border-l-2 border-muted ml-4 pl-6 pb-2 pt-1">
                <div className="mb-8 relative">
                  <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Case created</span>
                    <span className="text-xs text-muted-foreground ml-2">July 25, 2023 at 10:23 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Michael Chen created this case and assigned it to Jane Smith
                  </p>
                </div>
                
                <div className="mb-8 relative">
                  <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Tasks created</span>
                    <span className="text-xs text-muted-foreground ml-2">July 25, 2023 at 10:45 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Jane Smith created 4 tasks for this case
                  </p>
                </div>
                
                <div className="mb-8 relative">
                  <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Comment added</span>
                    <span className="text-xs text-muted-foreground ml-2">July 26, 2023 at 9:15 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Jane Smith added a comment
                  </p>
                </div>
                
                <div className="mb-8 relative">
                  <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Task completed</span>
                    <span className="text-xs text-muted-foreground ml-2">July 28, 2023 at 2:30 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sarah Johnson completed task "Verify Internal Controls Adherence"
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                  <div className="mb-1">
                    <span className="text-sm font-medium">Task status updated</span>
                    <span className="text-xs text-muted-foreground ml-2">July 30, 2023 at 11:05 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Michael Chen changed task "Collect Data from All Departments" to In Progress
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {caseDetails.deviationApproval?.isRequired && (
            <TabsContent value="deviation" className="animate-fade-in">
              <div className="glassmorphism rounded-xl p-6">
                <h2 className="text-xl font-medium mb-4">Deviation Approval</h2>
                
                <div className="mb-6">
                  <div className={`p-4 rounded-lg border ${
                    caseDetails.deviationApproval.status === 'pending'
                      ? 'bg-amber-50 border-amber-200'
                      : caseDetails.deviationApproval.status === 'approved'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center mb-3">
                      {caseDetails.deviationApproval.status === 'pending' ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      ) : caseDetails.deviationApproval.status === 'approved' ? (
                        <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <h3 className="text-sm font-semibold">
                        {caseDetails.deviationApproval.status === 'pending'
                          ? 'Pending Approval'
                          : caseDetails.deviationApproval.status === 'approved'
                          ? 'Deviation Approved'
                          : 'Deviation Rejected'
                        }
                      </h3>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-muted-foreground">Status:</div>
                        <div className="col-span-2 font-medium capitalize">
                          {caseDetails.deviationApproval.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-muted-foreground">Assigned to:</div>
                        <div className="col-span-2">
                          {caseDetails.deviationApproval.approver || 'Unassigned'}
                        </div>
                      </div>
                      
                      {caseDetails.deviationApproval.approvalDate && (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-muted-foreground">Review date:</div>
                          <div className="col-span-2">
                            {caseDetails.deviationApproval.approvalDate}
                          </div>
                        </div>
                      )}
                      
                      {caseDetails.deviationApproval.comments && (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-muted-foreground">Comments:</div>
                          <div className="col-span-2">
                            {caseDetails.deviationApproval.comments}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {caseDetails.deviationApproval.status === 'pending' && (
                  <Button
                    onClick={() => setIsDeviationDialogOpen(true)}
                    className="w-full md:w-auto"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Review Deviation Request
                  </Button>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default CaseDetail;
