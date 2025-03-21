
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import TaskItem, { Task, TaskStatus } from "@/components/TaskItem";
import TaskDetail from "@/components/TaskDetail";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review regulatory compliance documents',
    description: 'Go through the latest compliance documents and ensure all requirements are met.',
    status: 'pending',
    priority: 'high',
    dueDate: 'Aug 15, 2023',
    assignee: 'Jane Smith',
    commentsCount: 2,
    attachmentsCount: 1,
    caseId: '1'
  },
  {
    id: '2',
    title: 'Update AML process documentation',
    description: 'Update the Anti-Money Laundering documentation with the latest procedures.',
    status: 'inprogress',
    priority: 'medium',
    dueDate: 'Jul 30, 2023',
    assignee: 'Michael Chen',
    commentsCount: 4,
    attachmentsCount: 2,
    caseId: '2'
  },
  {
    id: '3',
    title: 'Client data verification check',
    description: 'Perform verification checks on new client data to ensure compliance with KYC regulations.',
    status: 'completed',
    priority: 'medium',
    dueDate: 'Jul 25, 2023',
    assignee: 'Sarah Johnson',
    commentsCount: 1,
    attachmentsCount: 0,
    caseId: '3'
  },
  {
    id: '4',
    title: 'Prepare quarterly compliance report',
    description: 'Compile data and prepare the quarterly compliance report for board review.',
    status: 'pending',
    priority: 'high',
    dueDate: 'Aug 10, 2023',
    assignee: 'David Lee',
    commentsCount: 0,
    attachmentsCount: 3,
    caseId: '4'
  },
  {
    id: '5',
    title: 'Update risk assessment framework',
    description: 'Incorporate new digital payment methods into the risk assessment framework.',
    status: 'inprogress',
    priority: 'high',
    dueDate: 'Aug 5, 2023',
    assignee: 'Michael Chen',
    commentsCount: 3,
    attachmentsCount: 1,
    caseId: '2'
  }
];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'inprogress' | 'completed'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    commentsCount: 0,
    attachmentsCount: 0
  });

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
    
    // Also update selectedTask if it's currently selected
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({ ...selectedTask, status });
    }
    
    toast.success(`Task status updated to ${status}`);
  };

  const handleCreateTask = () => {
    const task: Task = {
      ...newTask,
      id: `${tasks.length + 1}`,
    };
    
    setTasks([...tasks, task]);
    setIsNewTaskDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      commentsCount: 0,
      attachmentsCount: 0
    });
    toast.success('Task created successfully');
  };

  const handleTaskClick = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setSelectedTask(task);
      setIsTaskDetailOpen(true);
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Tasks</h1>
            <p className="text-muted-foreground">Manage all your compliance tasks</p>
          </div>
          
          <Button onClick={() => setIsNewTaskDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'inprogress' ? 'default' : 'outline'} 
            onClick={() => setFilter('inprogress')}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onClick={handleTaskClick}
            />
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          )}
        </div>
      </main>

      {/* New Task Dialog */}
      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Task title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="assignee" className="text-sm font-medium">Assignee</label>
                <Input
                  id="assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  placeholder="Assignee name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select 
                value={newTask.priority} 
                onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <TaskDetail 
          task={selectedTask}
          open={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Tasks;
