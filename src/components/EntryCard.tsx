import type { JournalEntry } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface EntryCardProps {
  entry: JournalEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const displayDate = format(parseISO(entry.date), "MMMM d, yyyy");

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{displayDate}</CardTitle>
        {/* Optional: could add a small description or icon here */}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground break-words whitespace-pre-wrap">{entry.sentence}</p>
      </CardContent>
    </Card>
  );
}
