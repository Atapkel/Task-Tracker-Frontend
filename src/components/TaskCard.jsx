import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(
    task.description || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (editedName.length < 3) {
      alert("Name must be at least 3 characters");
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(task.id, {
        name: editedName,
        description: editedDescription || null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedName(task.name);
    setEditedDescription(task.description || "");
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl leading-tight">{task.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Task name"
              autoFocus
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {task.description && (
              <p className="text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
