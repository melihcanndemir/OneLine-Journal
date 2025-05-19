// src/components/DailyInput.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import type { JournalEntry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { saveEntryToLocalStorage, getTodaysEntryFromLocalStorage } from "../lib/localstorage";

export function DailyInput() {
  const [todaysEntry, setTodaysEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sentence, setSentence] = useState('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEntryAndSetDate() {
      setIsLoading(true);
      const today = new Date();
      setFormattedDate(format(today, "MMMM d, yyyy"));

      const entry = getTodaysEntryFromLocalStorage();
      setTodaysEntry(entry);
      setIsLoading(false);
    }
    fetchEntryAndSetDate();
  }, []);

  const handleSaveSentence = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const today = new Date();
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: format(startOfDay(today), 'yyyy-MM-dd'),
      sentence: sentence.trim(),
      userId: 'mockUser',
    };

    if (newEntry.sentence.length === 0) {
      setError("Sentence cannot be empty.");
      setIsSaving(false);
      return;
    }

    try {
      saveEntryToLocalStorage(newEntry);
      setTodaysEntry(newEntry);
      toast({
        title: "Success",
        description: "Entry saved successfully!",
      });
    } catch (e) {
      setError("Failed to save entry.");
      toast({
        title: "Error",
        description: "Failed to save entry.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Today's Entry: {formattedDate}</CardTitle>
          <CardDescription>Loading your entry...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-muted rounded-md"></div>
            <div className="h-10 bg-muted rounded-md w-1/3 ml-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (todaysEntry) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Today's Entry: {formattedDate}</CardTitle>
          <CardDescription>Your thought for the day. Entries are final.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg p-4 bg-muted rounded-md break-words whitespace-pre-wrap">{todaysEntry.sentence}</p>
        </CardContent>
         <CardFooter>
          <p className="text-sm text-muted-foreground">You've already written your sentence for today.</p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <form onSubmit={handleSaveSentence}>
        <CardHeader>
          <CardTitle>Today's Entry: {formattedDate}</CardTitle>
          <CardDescription>Capture your single thought for today. Once saved, it cannot be changed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            name="sentence"
            placeholder="What's your one sentence for today?"
            className="min-h-[100px] text-base resize-none"
            aria-label="Today's sentence"
            required
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
          {error && (
             <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? "Saving..." : "Save Sentence"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
