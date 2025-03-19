
import { CalendarIcon, Check, ChevronDown, ChevronsUpDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const departments = [
  { label: "Compliance", value: "compliance" },
  { label: "Risk", value: "risk" },
  { label: "Audit", value: "audit" },
  { label: "Operations", value: "operations" },
  { label: "Legal", value: "legal" },
];

const statuses = [
  { label: "New", value: "new" },
  { label: "In Progress", value: "inprogress" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const priorities = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const CaseFilters = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [department, setDepartment] = useState("");
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [priority, setPriority] = useState("");
  const [priorityOpen, setPriorityOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full md:w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Due Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={departmentOpen}
            className="w-full md:w-[200px] justify-between font-normal"
          >
            {department
              ? departments.find((d) => d.value === department)?.label
              : "Department"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search department..." />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {departments.map((dept) => (
                <CommandItem
                  key={dept.value}
                  value={dept.value}
                  onSelect={(currentValue) => {
                    setDepartment(currentValue === department ? "" : currentValue);
                    setDepartmentOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      department === dept.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {dept.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={statusOpen}
            className="w-full md:w-[200px] justify-between font-normal"
          >
            {status
              ? statuses.find((s) => s.value === status)?.label
              : "Status"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((s) => (
                <CommandItem
                  key={s.value}
                  value={s.value}
                  onSelect={(currentValue) => {
                    setStatus(currentValue === status ? "" : currentValue);
                    setStatusOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      status === s.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {s.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={priorityOpen}
            className="w-full md:w-[200px] justify-between font-normal"
          >
            {priority
              ? priorities.find((p) => p.value === priority)?.label
              : "Priority"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search priority..." />
            <CommandEmpty>No priority found.</CommandEmpty>
            <CommandGroup>
              {priorities.map((p) => (
                <CommandItem
                  key={p.value}
                  value={p.value}
                  onSelect={(currentValue) => {
                    setPriority(currentValue === priority ? "" : currentValue);
                    setPriorityOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      priority === p.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {p.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Button variant="outline" className="md:ml-auto">
        <Filter className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
};

export default CaseFilters;
