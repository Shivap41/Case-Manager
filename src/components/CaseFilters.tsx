
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FilterValues {
  status: string[];
  department: string[];
  priority: string[];
  dateRange: { from?: Date; to?: Date };
  search: string;
}

interface CaseFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

const CaseFilters: React.FC<CaseFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    status: [],
    department: [],
    priority: [],
    dateRange: {},
    search: '',
  });

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Update search in filters
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, [searchTerm]);

  // Add filter to array
  const addFilter = (type: 'status' | 'department' | 'priority', value: string) => {
    if (!value) return;
    
    setFilters(prev => {
      // Only add if not already in the array
      if (!prev[type].includes(value)) {
        return {
          ...prev,
          [type]: [...prev[type], value],
        };
      }
      return prev;
    });

    // Reset the select
    if (type === 'status') setStatusFilter('');
    if (type === 'department') setDepartmentFilter('');
    if (type === 'priority') setPriorityFilter('');
  };

  // Remove filter from array
  const removeFilter = (type: 'status' | 'department' | 'priority', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value),
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      department: [],
      priority: [],
      dateRange: {},
      search: '',
    });
    setSearchTerm('');
  };

  // Check if any filters are applied
  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.department.length > 0 || 
    filters.priority.length > 0 || 
    !!filters.search;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status filter */}
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="inprogress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => addFilter('status', statusFilter)} disabled={!statusFilter}>
          Add Status
        </Button>

        {/* Department filter */}
        <Select value={departmentFilter} onValueChange={(value) => setDepartmentFilter(value)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => addFilter('department', departmentFilter)} disabled={!departmentFilter}>
          Add Dept
        </Button>

        {/* Priority filter */}
        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value)}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => addFilter('priority', priorityFilter)} disabled={!priorityFilter}>
          Add Priority
        </Button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.status.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              <button 
                onClick={() => removeFilter('status', status)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                ✕
              </button>
            </Badge>
          ))}
          {filters.department.map(dept => (
            <Badge key={dept} variant="secondary" className="flex items-center gap-1">
              Dept: {dept}
              <button 
                onClick={() => removeFilter('department', dept)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                ✕
              </button>
            </Badge>
          ))}
          {filters.priority.map(priority => (
            <Badge key={priority} variant="secondary" className="flex items-center gap-1">
              Priority: {priority}
              <button 
                onClick={() => removeFilter('priority', priority)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                ✕
              </button>
            </Badge>
          ))}
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.search}
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Visual indicator of active filters */}
      {hasActiveFilters && (
        <div className="pt-1">
          <Progress value={
            (filters.status.length > 0 ? 25 : 0) + 
            (filters.department.length > 0 ? 25 : 0) + 
            (filters.priority.length > 0 ? 25 : 0) + 
            (filters.search ? 25 : 0)
          } />
        </div>
      )}
    </div>
  );
};

export default CaseFilters;
