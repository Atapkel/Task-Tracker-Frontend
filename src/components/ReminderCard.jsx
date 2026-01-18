import { CalendarDays, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const ReminderCard = ({ reminder }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border-l-4 border-l-amber-400">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg leading-tight">
          {reminder.message}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {reminder.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <User className="h-4 w-4" />
          {reminder.author}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {formatDate(reminder.created_at)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default ReminderCard;
