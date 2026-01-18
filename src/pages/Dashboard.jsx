import { ClipboardList, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReminders, getTasks } from "../api/api";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

const Dashboard = () => {
  const [stats, setStats] = useState({
    taskCount: 0,
    reminderCount: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasks, reminders] = await Promise.all([
          getTasks(),
          getReminders(),
        ]);

        setStats({
          taskCount: tasks.length,
          reminderCount: reminders.length,
        });
        setRecentTasks(tasks.slice(-3).reverse());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-72" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-56" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Task Manager
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your tasks and reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Total tasks</CardTitle>
              <CardDescription>
                Everything you need to get done.
              </CardDescription>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-4">
            <p className="text-3xl font-semibold">{stats.taskCount}</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/tasks">View tasks</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Total reminders</CardTitle>
              <CardDescription>
                Don't let important things slip.
              </CardDescription>
            </div>
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <BellRing className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-4">
            <p className="text-3xl font-semibold">{stats.reminderCount}</p>
            <Button asChild variant="outline" size="sm">
              <Link to="/reminders">View reminders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent tasks</CardTitle>
            <CardDescription>Last three items you've created.</CardDescription>
          </div>
          <Button asChild variant="link" className="px-0">
            <Link to="/tasks">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentTasks.length > 0 ? (
            <ul className="space-y-3">
              {recentTasks.map((task) => (
                <li key={task.id} className="rounded-md border bg-card/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium leading-tight">{task.name}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">Task</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md border border-dashed bg-muted/50 p-6 text-center">
              <p className="text-muted-foreground">No tasks yet.</p>
              <Button asChild variant="link" className="mt-1 px-0">
                <Link to="/tasks">Create your first task</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
