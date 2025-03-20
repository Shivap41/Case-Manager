
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCases, Case, CaseStatus } from "@/context/CaseContext";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  owner: z.string().min(2, {
    message: "Owner must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  dueDate: z.string(),
  priority: z.string().optional(),
  requiresDeviation: z.boolean().default(false),
  deviationApprover: z.string().optional(),
  deviationComments: z.string().optional().refine(
    (val) => {
      // If requiresDeviation is true, deviationComments is required
      return true;
    },
    {
      message: "Deviation comments are required when requesting deviation approval",
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCase = () => {
  const navigate = useNavigate();
  const { addCase } = useCases();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      owner: "",
      department: "",
      dueDate: "",
      priority: "Medium",
      requiresDeviation: false,
      deviationApprover: "",
      deviationComments: "",
    },
  });

  // Update the validation rules when requiresDeviation changes
  useEffect(() => {
    const requiresDeviation = form.watch("requiresDeviation");
    const currentComments = form.watch("deviationComments");
    
    if (requiresDeviation && (!currentComments || currentComments.trim() === "")) {
      form.setError("deviationComments", {
        type: "manual",
        message: "Deviation comments are required when requesting deviation approval",
      });
    } else if (!requiresDeviation) {
      form.clearErrors("deviationComments");
    }
  }, [form.watch("requiresDeviation")]);

  const onSubmit = (data: FormValues) => {
    // Check if deviation is required but comments are missing
    if (data.requiresDeviation && (!data.deviationComments || data.deviationComments.trim() === "")) {
      form.setError("deviationComments", {
        type: "manual",
        message: "Deviation comments are required when requesting deviation approval",
      });
      return;
    }

    const newCase: Omit<Case, "id"> = {
      title: data.title,
      description: data.description,
      status: "new" as CaseStatus,
      owner: data.owner,
      department: data.department,
      dueDate: data.dueDate,
      comments: 0,
      attachments: 0,
      tasks: 0,
      completedTasks: 0,
      priority: data.priority || "Medium",
      createdDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      createdBy: "Current User",
      deviationApproval: data.requiresDeviation ? {
        isRequired: true,
        status: 'pending',
        approver: data.deviationApprover || undefined,
        comments: data.deviationComments
      } : undefined
    };

    addCase(newCase);
    
    toast.success("Case created successfully!");
    navigate("/");
  };

  const handleCancel = () => {
    toast.info("Case creation cancelled");
    navigate("/");
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Case</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter case title" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of the case.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter case description"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of the case.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter case owner" {...field} />
                  </FormControl>
                  <FormDescription>
                    The person responsible for this case.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department" {...field} />
                  </FormControl>
                  <FormDescription>
                    The department associated with this case.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    The date by which this case should be resolved.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The priority of the case.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="requiresDeviation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Requires Deviation Approval</FormLabel>
                  <FormDescription>
                    Enable if this case requires deviation approval.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("requiresDeviation") && (
            <>
              <FormField
                control={form.control}
                name="deviationApprover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deviation Approver</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter deviation approver"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The person responsible for approving deviations for this
                      case.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deviationComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Deviation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain why this deviation is needed"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed explanation for why this deviation is required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex items-center justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Case</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCase;
