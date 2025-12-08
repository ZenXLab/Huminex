import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const TasksWidget = () => {
  // Mock data - would come from API
  const taskStats = {
    total: 12,
    completed: 7,
    inProgress: 3,
    overdue: 2,
  };

  const tasks = [
    { id: 1, title: "Complete Q4 Report", priority: "high", dueDate: "Today", status: "in_progress" },
    { id: 2, title: "Review team proposals", priority: "medium", dueDate: "Tomorrow", status: "pending" },
    { id: 3, title: "Update project documentation", priority: "low", dueDate: "Dec 12", status: "pending" },
    { id: 4, title: "Client presentation prep", priority: "high", dueDate: "Yesterday", status: "overdue" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-600";
      case "medium": return "bg-yellow-500/20 text-yellow-600";
      case "low": return "bg-green-500/20 text-green-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in_progress": return <Clock className="w-4 h-4 text-blue-500" />;
      case "overdue": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const completionPercentage = (taskStats.completed / taskStats.total) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            My Tasks
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Plus className="w-3 h-3" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{taskStats.completed}/{taskStats.total} completed</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-500/10 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-blue-600">{taskStats.inProgress}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-600">{taskStats.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-red-600">{taskStats.overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Upcoming Tasks</p>
          <div className="space-y-2 max-h-[180px] overflow-y-auto">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                    <span className={`text-xs ${task.status === "overdue" ? "text-red-500" : "text-muted-foreground"}`}>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="link" size="sm" className="h-auto p-0 text-xs w-full">
          View All Tasks →
        </Button>
      </CardContent>
    </Card>
  );
};
