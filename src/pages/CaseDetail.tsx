import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import TaskItem from '@/components/TaskItem';
import DocumentAttachment from '@/components/DocumentAttachment';
import CommentSection from '@/components/CommentSection';
import { 
  AlertCircle, Calendar, ChevronLeft, Clock, MessageSquare, Paperclip, Plus, User, 
  CheckCircle2, AlertTriangle, ShieldCheck, ArrowUp, ThumbsUp, ThumbsDown, Send, X
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useCases, Case, DeviationApproval, NormalApproval } from '@/context/CaseContext';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

const commentSchema = z.object({
  comment: z.string().min(1, "Comment is required").refine(
    (val) => val.trim().length > 0,
    {
      message: "Comment cannot be empty"
    }
  )
});

const requestApprovalSchema = z.object({
  approvalType: z.enum(['normal', 'deviation']),
  approver: z.string().min(2, "Approver name is required"),
  comments: z.string().min(10, "Comments must be at least 10 characters")
});

const processApprovalSchema = z.object({
  action: z.enum(['approve', 'reject', 'escalate']),
  comments: z.string().min(10, "Comments must be at least 10 characters"),
  escalateTo: z.string().optional().refine(
    (val, ctx) => {
      if (ctx.data.action === 'escalate' && (!val || val.length < 2)) {
        return false;
      }
      return true;
    },
    {
      message: "Escalation recipient is required when escalating",
    }
  )
});

const finalApprovalSchema = z.object({
  action: z.enum(['approve', 'reject']),
  comments: z.string().min(10, "Comments must be at least 10 characters")
});

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
  const { getCaseById, processApproval, processFinalApproval, requestApproval } = useCases();
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
  const [isRequestApprovalOpen, setIsRequestApprovalOpen] = useState(false);
  const [isProcessApprovalOpen, setIsProcessApprovalOpen] = useState(false);
  const [isFinalApprovalOpen, setIsFinalApprovalOpen] = useState(false);
  
  const taskForm = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: ''
    }
  });

  const requestApprovalForm = useForm<z.infer<typeof requestApprovalSchema>>({
    resolver: zodResolver(requestApprovalSchema),
    defaultValues: {
      approvalType: 'normal',
      approver: '',
      comments: ''
    }
  });

  const processApprovalForm = useForm<z.infer<typeof processApprovalSchema>>({
    resolver: zodResolver(processApprovalSchema),
    defaultValues: {
      action: 'approve',
      comments: '',
      escalateTo: ''
    }
  });

  const finalApprovalForm = useForm<z.infer<typeof finalApprovalSchema>>({
    resolver: zodResolver(finalApprovalSchema),
    defaultValues: {
      action: 'approve',
      comments: ''
    }
  });

  const isCaseOwner = true;

  const isFirstLevelApprover = caseDetails.pendingApprovalType && 
    (caseDetails.pendingApprovalType === 'normal' 
      ? caseDetails.normalApproval?.approver === 'Current User'
      : caseDetails.deviationApproval?.approver === 'Current User');

  const isSecondLevelApprover = caseDetails.pendingApprovalType && 
    caseDetails.currentApprovalLevel === 'secondLevel' &&
    (caseDetails.pendingApprovalType === 'normal'
      ? caseDetails.normalApproval?.escalatedTo === 'Current User'
      : caseDetails.deviationApproval?.escalatedTo === 'Current User');

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

  const handleRequestApproval = (data: z.infer<typeof requestApprovalSchema>) => {
    if (!id) return;

    requestApproval(id, data.approvalType, data.approver, data.comments);
    setIsRequestApprovalOpen(false);
    toast.success(`${data.approvalType === 'normal' ? 'Normal' : 'Deviation'} approval requested successfully`);
  };

  const handleProcessApproval = (data: z.infer<typeof processApprovalSchema>) => {
    if (!id) return;

    processApproval(id, data.action, data.comments, data.action === 'escalate' ? data.escalateTo : undefined);
    setIsProcessApprovalOpen(false);
    
    const actionText = data.action === 'approve' 
      ? 'approved' 
      : data.action === 'reject'
      ? 'rejected'
      : 'escalated';
    
    toast.success(`Case ${actionText} successfully`);
  };

  const handleFinalApproval = (data: z.infer<typeof finalApprovalSchema>) => {
    if (!id) return;

    processFinalApproval(id, data.action, data.comments);
    setIsFinalApprovalOpen(false);
    
    const actionText = data.action === 'approve' 
      ? 'approved' 
      : 'rejected';
    
    toast.success(`Case ${actionText} successfully`);
  };

  const getApprovalDetails = () => {
    if (!caseDetails.pendingApprovalType) return null;
    
    return caseDetails.pendingApprovalType === 'normal'
      ? caseDetails.normalApproval
      : caseDetails.deviationApproval;
  };

  const approvalDetails = getApprovalDetails();

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
                    : caseDetails.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-case-completed text-case-completed-foreground'}`}
              >
                {caseDetails.status === 'inprogress' 
                  ? 'In Progress' 
                  : caseDetails.status === 'new'
                  ? 'New'
                  : caseDetails.status === 'pending'
                  ? 'Pending'
                  : caseDetails.status === 'rejected'
                  ? 'Rejected'
                  : 'Completed'}
              </span>
              
              {caseDetails.pendingApprovalType && (
                <span 
                  className={`ml-2 text-xs px-2.5 py-1 rounded-full flex items-center
                    ${approvalDetails?.status === 'pending' 
                      ? 'bg-amber-100 text-amber-800' 
                      : approvalDetails?.status === 'approved' || approvalDetails?.finalDecision === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : approvalDetails?.status === 'escalated'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'}`}
                >
                  {approvalDetails?.status === 'pending' 
                    ? <AlertTriangle className="h-3 w-3 mr-1" />
                    : approvalDetails?.status === 'approved' || approvalDetails?.finalDecision === 'approved'
                    ? <ShieldCheck className="h-3 w-3 mr-1" />
                    : approvalDetails?.status === 'escalated'
                    ? <ArrowUp className="h-3 w-3 mr-1" />
                    : <X className="h-3 w-3 mr-1" />}
                  {approvalDetails?.status === 'pending' 
                    ? `${caseDetails.pendingApprovalType === 'normal' ? 'Normal' : 'Deviation'} Approval Pending` 
                    : approvalDetails?.status === 'approved' || approvalDetails?.finalDecision === 'approved'
                    ? 'Approved'
                    : approvalDetails?.status === 'escalated'
                    ? 'Escalated'
                    : 'Rejected'}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1">Case #{caseDetails.id}</p>
          </div>
          
          {isCaseOwner && caseDetails.status === 'inprogress' && (
            <Dialog open={isRequestApprovalOpen} onOpenChange={setIsRequestApprovalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <Send className="h-4 w-4 mr-2" />
                  Request Approval
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Case Approval</DialogTitle>
                </DialogHeader>
                <Form {...requestApprovalForm}>
                  <form onSubmit={requestApprovalForm.handleSubmit(handleRequestApproval)} className="space-y-4 pt-4">
                    <FormField
                      control={requestApprovalForm.control}
                      name="approvalType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approval Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select approval type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="normal">Normal Closure</SelectItem>
                              <SelectItem value="deviation">Deviation Closure</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select whether this requires normal or deviation approval
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={requestApprovalForm.control}
                      name="approver"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approver</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select approver" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                              <SelectItem value="David Lee">David Lee</SelectItem>
                              <SelectItem value="Robert Kim">Robert Kim</SelectItem>
                              <SelectItem value="Emily Wang">Emily Wang</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select who should approve this case
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={requestApprovalForm.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add comments explaining why approval is needed" 
                              {...field} 
                              rows={3} 
                            />
                          </FormControl>
                          <FormDescription>
                            Comments are required for approval requests
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          
          {isFirstLevelApprover && caseDetails.status === 'pending' && (
            <Dialog open={isProcessApprovalOpen} onOpenChange={setIsProcessApprovalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Process Approval
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {caseDetails.pendingApprovalType === 'normal' 
                      ? 'Process Normal Closure Approval' 
                      : 'Process Deviation Approval'}
                  </DialogTitle>
                </DialogHeader>
                <Form {...processApprovalForm}>
                  <form onSubmit={processApprovalForm.handleSubmit(handleProcessApproval)} className="space-y-4 pt-4">
                    <div className="p-3 bg-muted rounded-md mb-4">
                      <p className="text-sm font-medium">Request from: {caseDetails.owner}</p>
                      <p className="text-sm mt-1">
                        {caseDetails.pendingApprovalType === 'normal' 
                          ? caseDetails.normalApproval?.comments 
                          : caseDetails.deviationApproval?.comments}
                      </p>
                    </div>
                    
                    <FormField
                      control={processApprovalForm.control}
                      name="action"
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
                              <SelectItem value="approve">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Approve
                                </div>
                              </SelectItem>
                              <SelectItem value="reject">
                                <div className="flex items-center">
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Reject
                                </div>
                              </SelectItem>
                              <SelectItem value="escalate">
                                <div className="flex items-center">
                                  <ArrowUp className="h-4 w-4 mr-2" />
                                  Escalate
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose whether to approve, reject, or escalate this request
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {processApprovalForm.watch('action') === 'escalate' && (
                      <FormField
                        control={processApprovalForm.control}
                        name="escalateTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Escalate To <span className="text-red-500">*</span></FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select higher approver" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Emily Wang">Emily Wang</SelectItem>
                                <SelectItem value="Robert Kim">Robert Kim</SelectItem>
                                <SelectItem value="William Taylor">William Taylor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select who should handle this escalated case
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={processApprovalForm.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add comments explaining your decision" 
                              {...field} 
                              rows={3} 
                            />
                          </FormControl>
                          <FormDescription>
                            Comments are required for all approval decisions
                          </FormDescription>
                          <FormMessage />
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
                </Form>
              </DialogContent>
            </Dialog>
          )}
          
          {isSecondLevelApprover && caseDetails.status === 'pending' && (
            <Dialog open={isFinalApprovalOpen} onOpenChange={setIsFinalApprovalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Final Approval
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Final {caseDetails.pendingApprovalType === 'normal' 
                      ? 'Normal Closure Approval' 
                      : 'Deviation Approval'}
                  </DialogTitle>
                </DialogHeader>
                <Form {...finalApprovalForm}>
                  <form onSubmit={finalApprovalForm.handleSubmit(handleFinalApproval)} className="space-y-4 pt-4">
                    <div className="p-3 bg-muted rounded-md mb-4">
                      <p className="text-sm font-medium">Escalated by: {
                        caseDetails.pendingApprovalType === 'normal' 
                          ? caseDetails.normalApproval?.approver 
                          : caseDetails.deviationApproval?.approver
                      }</p>
                      <p className="text-sm mt-1">
                        {caseDetails.pendingApprovalType === 'normal' 
                          ? caseDetails.normalApproval?.escalationComments 
                          : caseDetails.deviationApproval?.escalationComments}
                      </p>
                    </div>
                    
                    <FormField
                      control={finalApprovalForm.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Final Decision</FormLabel>
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
                              <SelectItem value="approve">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Approve
                                </div>
                              </SelectItem>
                              <SelectItem value="reject">
                                <div className="flex items-center">
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Reject
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose whether to approve or reject this request
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={finalApprovalForm.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add comments explaining your decision" 
                              {...field} 
                              rows={3} 
                            />
                          </FormControl>
                          <FormDescription>
                            Comments are required for all approval decisions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className="pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Submit Final Decision</Button>
                    </DialogFooter>
                  </form>
                </Form>
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
            {caseDetails.pendingApprovalType && (
              <TabsTrigger value="approval">
                {caseDetails.pendingApprovalType === 'normal' ? 'Normal Approval' : 'Deviation Approval'}
              </TabsTrigger>
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
                  task={task}
                  onStatusChange={handleTaskStatusChange}
                />
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks found for this case. Create a new task to get started.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Documents</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
            
            <div className="glassmorphism rounded-xl p-6">
              <DocumentAttachment
                documents={[
                  { id: '1', name: 'Compliance Report.pdf', type: 'pdf', size: '1.2 MB', uploadedBy: 'Jane Smith', uploadedDate: 'Aug 5, 2023' },
                  { id: '2', name: 'Regulatory Guidelines.docx', type: 'word', size: '845 KB', uploadedBy: 'David Lee', uploadedDate: 'Aug 7, 2023' },
                  { id: '3', name: 'Department Data.xlsx', type: 'excel', size: '1.5 MB', uploadedBy: 'Michael Chen', uploadedDate: 'Aug 8, 2023' },
                ]}
              />
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
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full mr-4">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium">Michael Chen</p>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">Aug 12, 2023 at 10:23 AM</p>
                    </div>
                    <p className="mt-1 text-sm">Created the case</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-full mr-4">
                    <Paperclip className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium">Sarah Johnson</p>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">Aug 12, 2023 at 2:45 PM</p>
                    </div>
                    <p className="mt-1 text-sm">Added document: <span className="font-medium">Compliance Report.pdf</span></p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full mr-4">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium">Jane Smith</p>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">Aug 13, 2023 at 9:10 AM</p>
                    </div>
                    <p className="mt-1 text-sm">Added a comment: "We should prioritize the regulatory compliance aspects of this case."</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-amber-100 p-2 rounded-full mr-4">
                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <p className="font-medium">David Lee</p>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">Aug 14, 2023 at 3:30 PM</p>
                    </div>
                    <p className="mt-1 text-sm">Completed task: <span className="font-medium">Verify Internal Controls Adherence</span></p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {caseDetails.pendingApprovalType && (
            <TabsContent value="approval" className="animate-fade-in">
              <div className="glassmorphism rounded-xl p-6">
                <h2 className="text-xl font-medium mb-4">
                  {caseDetails.pendingApprovalType === 'normal' ? 'Normal Closure Approval' : 'Deviation Approval'} Details
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Request Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Requested By</p>
                        <p className="text-sm font-medium">{caseDetails.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Request Date</p>
                        <p className="text-sm font-medium">
                          {caseDetails.pendingApprovalType === 'normal'
                            ? caseDetails.normalApproval?.requestDate
                            : caseDetails.deviationApproval?.requestDate}
                        </p>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-xs text-muted-foreground">Request Comments</p>
                        <p className="text-sm">
                          {caseDetails.pendingApprovalType === 'normal'
                            ? caseDetails.normalApproval?.comments
                            : caseDetails.deviationApproval?.comments}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Approval Status</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
                      
                      <div className="relative pl-10 pb-6">
                        <div className="absolute left-[15px] -translate-x-1/2 top-1 w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="text-sm font-medium">
                            Request Submitted to {approvalDetails?.approver}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {approvalDetails?.requestDate}
                          </p>
                        </div>
                      </div>
                      
                      {approvalDetails?.status === 'approved' && (
                        <div className="relative pl-10 pb-6">
                          <div className="absolute left-[15px] -translate-x-1/2 top-1 w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="text-sm font-medium">
                              Approved by {approvalDetails.approver}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {approvalDetails.approvalDate}
                            </p>
                            <p className="text-sm mt-1">
                              {approvalDetails.approvalComments}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {approvalDetails?.status === 'rejected' && (
                        <div className="relative pl-10 pb-6">
                          <div className="absolute left-[15px] -translate-x-1/2 top-1 w-2 h-2 rounded-full bg-red-500"></div>
                          <div>
                            <p className="text-sm font-medium">
                              Rejected by {approvalDetails.approver}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {approvalDetails.rejectionDate}
                            </p>
                            <p className="text-sm mt-1">
                              {approvalDetails.rejectionComments}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {approvalDetails?.status === 'escalated' && (
                        <>
                          <div className="relative pl-10 pb-6">
                            <div className="absolute left-[15px] -translate-x-1/2 top-1 w-2 h-2 rounded-full bg-blue-500"></div>
                            <div>
                              <p className="text-sm font-medium">
                                Escalated by {approvalDetails.approver} to {approvalDetails.escalatedTo}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {approvalDetails.escalationDate}
                              </p>
                              <p className="text-sm mt-1">
                                {approvalDetails.escalationComments}
                              </p>
                            </div>
                          </div>
                          
                          {approvalDetails.finalDecision === 'approved' ? (
                            <div className="relative pl-10 pb-6">
                              <div className="absolute left-[15px] -translate-x-1/2 top-1 w-2 h-2 rounded-full bg-green-500"></div>
                              <div>
                                <p className="text-sm font-medium">
                                  Final Approval by {approvalDetails.escalatedTo}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {approvalDetails.finalDecisionDate}
                                </p>
                                <p className="text-sm mt-1">
                                  {approvalDetails.finalDecisionComments}
                                </p>
                              </div>
                            </div>
                          ) : approvalDetails.finalDecision === 'rejected' ? (
                            <div className="relative pl-10 pb-6">
                              <div className="absolute left-[15px] -translate-x-1/2 top-1 w-2 h-2 rounded-full bg-red-500"></div>
                              <div>
                                <p className="text-sm font-medium">
                                  Final Rejection by {approvalDetails.escalatedTo}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {approvalDetails.finalDecisionDate}
                                </p>
                                <p className="text-sm mt-1">
                                  {approvalDetails.finalDecisionComments}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="relative pl-10 pb-6">
                              <div className="absolute left-[15px] -translate-x-1/2 top-1 w-2 h-2 rounded-full bg-amber-500"></div>
                              <div>
                                <p className="text-sm font-medium">
                                  Pending final decision from {approvalDetails.escalatedTo}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default CaseDetail;

