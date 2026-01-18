import { useCallback, useEffect, useState } from "react";
import { createReminder, getReminders } from "../api/api";
import ReminderCard from "../components/ReminderCard";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Skeleton } from "../components/ui/skeleton";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    message: "",
    description: "",
    author: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchReminders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getReminders();
      setReminders(data);
      setError("");
    } catch (err) {
      setError("Failed to load reminders");
      console.error("Error fetching reminders:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.author.trim()) {
      errors.author = "Author is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const newReminder = await createReminder(formData);
      setReminders((prev) => [newReminder, ...prev]);
      setFormData({ message: "", description: "", author: "" });
    } catch (err) {
      setError("Failed to create reminder");
      console.error("Error creating reminder:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
        <p className="text-muted-foreground">
          Keep track of important reminders.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create a reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="message"
                  name="message"
                  type="text"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter reminder message"
                  disabled={isCreating}
                  aria-invalid={Boolean(formErrors.message)}
                />
                {formErrors.message && (
                  <p className="text-sm text-destructive">
                    {formErrors.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter description"
                  disabled={isCreating}
                  aria-invalid={Boolean(formErrors.description)}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">
                  Author <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  disabled={isCreating}
                  aria-invalid={Boolean(formErrors.author)}
                />
                {formErrors.author && (
                  <p className="text-sm text-destructive">
                    {formErrors.author}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create reminder"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <ReminderCard key={index} reminder={reminder} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <p className="text-muted-foreground">No reminders yet.</p>
                <Button variant="ghost" size="sm" onClick={fetchReminders}>
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

export default Reminders;
