
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
import { AlertCircle, Calendar, ChevronLeft, Clock, MessageSquare, Paperclip, Plus, User, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

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

// Sample tasks for demonstration
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

type TaskFormValues = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
};

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeTab, setActiveTab] = useState('details');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCloseCaseOpen, setIsCloseCaseOpen] = useState(false);

  const taskForm = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      dueDate: ''
    }
  });

  // In a real application, you would fetch the case details using the ID
  const caseDetails = {
    id: id || '1',
    title: 'Regulatory Compliance Review - Q2',
    description: 'Quarterly review of regulatory compliance standards across all departments. Ensure all new regulations are properly implemented and documented according to the latest guidelines.',
    status: 'inprogress',
    owner: 'Jane Smith',
    department: 'Compliance',
    createdBy: 'Michael Chen',
    createdDate: 'July 25, 2023',
    dueDate: 'August 15, 2023',
    priority: 'High'
  };

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
    // Generate a simple ID (in a real app, this would be from a server)
    const newTaskId = `task-${Date.now()}`;
    
    // Create the new task
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
    
    // Add the new task to the tasks array
    setTasks([...tasks, newTask]);
    
    // Close the dialog and show a success message
    setIsCreateTaskOpen(false);
    taskForm.reset();
    toast.success('Task created successfully');
  };

  const handleCloseCase = () => {
    // In a real app, this would make an API call to update the case status
    toast.success('Case closed successfully');
    setIsCloseCaseOpen(false);
    // Redirect to cases list after a short delay
    setTimeout(() => navigate('/'), 1500);
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
                    : 'bg-blue-100 text-blue-800'}`}
              >
                In Progress
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">Case #{caseDetails.id}</p>
          </div>
          
          <div className="flex space-x-2">
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
            <Button>
              Edit Case
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Case Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
};

export default CaseDetail;
