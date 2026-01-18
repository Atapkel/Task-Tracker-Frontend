import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const TaskForm = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (description && description.length < 3) {
      newErrors.description = "Description must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const taskData = {
      name: name.trim(),
      description: description.trim() || null,
    };
    try {
      await onSubmit(taskData);

      setName("");
      setDescription("");
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a task</CardTitle>
        <CardDescription>Capture the work you want to track.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">
              Task name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
              disabled={isLoading}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description (optional)</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes or context"
              disabled={isLoading}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
