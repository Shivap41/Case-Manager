
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import DocumentAttachment from '@/components/DocumentAttachment';
import Header from '@/components/Header';
import { CalendarIcon, ChevronLeft, SaveIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CreateCase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    caseOwner: '',
    caseAssignee: '',
    priority: '',
  });
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.department || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real application, you would submit the form data to an API
    
    toast.success('Case created successfully!');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4 max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-semibold mb-6">Create New Case</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Case Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter case title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Case Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter detailed description of the case"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="min-h-[120px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium mb-1">
                  Department <span className="text-destructive">*</span>
                </label>
                <Select 
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="risk">Risk</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                  Due Date <span className="text-destructive">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label htmlFor="caseOwner" className="block text-sm font-medium mb-1">
                  Case Owner
                </label>
                <Select 
                  value={formData.caseOwner}
                  onValueChange={(value) => handleSelectChange('caseOwner', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select case owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="michael">Michael Chen</SelectItem>
                    <SelectItem value="david">David Lee</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="caseAssignee" className="block text-sm font-medium mb-1">
                  Case Assignee
                </label>
                <Select 
                  value={formData.caseAssignee}
                  onValueChange={(value) => handleSelectChange('caseAssignee', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select case assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jane">Jane Smith</SelectItem>
                    <SelectItem value="michael">Michael Chen</SelectItem>
                    <SelectItem value="david">David Lee</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <Select 
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DocumentAttachment />
          
          <div className="flex justify-end space-x-3 pt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <SaveIcon className="h-4 w-4 mr-2" />
              Create Case
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCase;
