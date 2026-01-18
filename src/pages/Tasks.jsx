import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "../api/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData) => {
    setIsCreating(true);
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      setError("");
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to create task";
      setError(typeof message === "string" ? message : JSON.stringify(message));
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    const updatedTask = await updateTask(id, taskData);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task)),
    );
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and stay organized.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <TaskForm onSubmit={handleCreateTask} isLoading={isCreating} />

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <p className="text-muted-foreground">No tasks yet.</p>
                <Button onClick={() => fetchTasks()} variant="ghost" size="sm">
                  Refresh
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
