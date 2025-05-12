// src/components/DailyInput.tsx
"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react"; // Changed from react-dom
import { useFormStatus } from "react-dom"; // useFormStatus remains in react-dom
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { addEntry, FormState, getTodaysEntry } from "@/lib/actions";
import type { JournalEntry } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea"; // Using Textarea for potentially longer sentences

const initialState: FormState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Saving..." : "Save Sentence"}
    </Button>
  );
}

export function DailyInput() {
  const [todaysEntry, setTodaysEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, formAction] = useActionState(addEntry, initialState); // Changed useFormState to useActionState
  const { toast } = useToast();

  const today = new Date();
  const formattedDate = format(today, "MMMM d, yyyy");

  useEffect(() => {
    async function fetchEntry() {
      setIsLoading(true);
      const entry = await getTodaysEntry();
      setTodaysEntry(entry);
      setIsLoading(false);
    }
    fetchEntry();
  }, []);

  useEffect(() => {
    if (formState.message && !formState.success && formState.errors?._form) {
       toast({
        title: "Error",
        description: formState.errors._form.join(", "),
        variant: "destructive",
      });
    }
    if (formState.success && formState.message) {
      toast({
        title: "Success",
        description: formState.message,
      });
      if (formState.entry) {
        setTodaysEntry(formState.entry);
      }
      // Reset form or relevant states if needed, e.g. by clearing the input.
      // Next.js router.refresh() can also be used if form is not part of this component state
      // For this simple form, once submitted and entry exists, it becomes read-only.
    }
  }, [formState, toast]);

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
      <form action={formAction}>
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
          />
          {formState.errors?.sentence && (
            <p className="text-sm text-destructive">{formState.errors.sentence.join(", ")}</p>
          )}
          {formState.errors?._form && (
             <p className="text-sm text-destructive">{formState.errors._form.join(", ")}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
