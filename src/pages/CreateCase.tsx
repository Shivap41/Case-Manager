
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { toast } from 'sonner';
import { useCases } from '@/context/CaseContext';
import { format } from 'date-fns';

const CreateCase = () => {
  const navigate = useNavigate();
  const { addCase } = useCases();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    owner: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.department) {
      toast.error('Please fill out all required fields');
      return;
    }

    // Create the new case
    const today = new Date();
    const formattedDate = format(today, 'MMM d');
    
    // Add the case using our context
    addCase({
      title: formData.title,
      description: formData.description,
      status: 'new',
      owner: formData.owner || 'Unassigned',
      department: formData.department,
      dueDate: formData.dueDate ? format(new Date(formData.dueDate), 'MMM d') : `${formattedDate} (Today)`,
      comments: 0,
      attachments: 0,
      tasks: 0,
      completedTasks: 0
    });
    
    toast.success('Case created successfully');
    
    // Navigate back to the main dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 px-4 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Create New Case</h1>
          <p className="text-muted-foreground">Create a new compliance case to track and manage</p>
        </div>
        
        <div className="glassmorphism rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Case Title <span className="text-red-500">*</span>
              </label>
              <Input 
                id="title" 
                name="title"
                placeholder="Enter case title" 
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea 
                id="description" 
                name="description"
                placeholder="Enter case description" 
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">
                  Department <span className="text-red-500">*</span>
                </label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleSelectChange('department', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Risk">Risk</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Audit">Audit</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Customer Service">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="owner" className="text-sm font-medium">
                  Case Owner
                </label>
                <Select 
                  value={formData.owner} 
                  onValueChange={(value) => handleSelectChange('owner', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select case owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="David Lee">David Lee</SelectItem>
                    <SelectItem value="Emily Wang">Emily Wang</SelectItem>
                    <SelectItem value="Robert Kim">Robert Kim</SelectItem>
                    <SelectItem value="Olivia Martinez">Olivia Martinez</SelectItem>
                    <SelectItem value="William Taylor">William Taylor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
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
              
              <div className="space-y-2">
                <label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </label>
                <Input 
                  id="dueDate" 
                  name="dueDate"
                  type="date" 
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button type="submit">Create Case</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCase;
