// src/lib/actions.ts
"use server";

import type { JournalEntry } from './types';
import { format } from 'date-fns';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const LOCAL_STORAGE_KEY = "journalEntries";

const SentenceSchema = z.object({
  sentence: z.string().min(1, "Sentence cannot be empty.").max(500, "Sentence cannot exceed 500 characters."),
});

export interface FormState {
  message: string;
  errors?: {
    sentence?: string[];
    _form?: string[];
  };
  success: boolean;
  entry?: JournalEntry;
}

function getEntriesFromLocalStorage(): JournalEntry[] {
  if (typeof window === 'undefined') {
    return []; // Return empty array if not in browser environment
  }
  const entries = localStorage.getItem(LOCAL_STORAGE_KEY);
  return entries ? JSON.parse(entries) : [];
}

export async function addEntry(prevState: FormState, formData: FormData): Promise<FormState> {
    const todayString = format(new Date(), 'yyyy-MM-dd');
    
    const existingEntry = getEntriesFromLocalStorage().find(entry => entry.date === todayString);
    if (existingEntry) {
        // Revalidate path even if entry exists to ensure UI is up-to-date
        return { success: false, message: "An entry for today already exists.", errors: { _form: ["An entry for today already exists."]}};
    }

    const validatedFields = SentenceSchema.safeParse({
        sentence: formData.get('sentence'),
    });

    if (!validatedFields.success) {
        return {
            message: "Validation failed.",
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }
    
    const { sentence } = validatedFields.data;

    const currentEntries = getEntriesFromLocalStorage();

    const newEntry: JournalEntry = {
        id: Date.now().toString(), // Simple ID generation
        date: todayString,
        sentence,
        userId: "mockUser", // You might want to handle user IDs differently with local storage or remove it
    };
    const updatedEntries = [...currentEntries, newEntry];

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEntries));
    }
    
    revalidatePath('/');
    revalidatePath('/history');

    return { success: true, message: "Entry added successfully!", entry: newEntry };
}

export async function getTodaysEntry(): Promise<JournalEntry | null> {
    const todayString = format(new Date(), 'yyyy-MM-dd');
    const entries = getEntriesFromLocalStorage();
    const entry = entries.find(e => e.date === todayString);
    return entry || null;
}

export async function getPastEntries(): Promise<JournalEntry[]> {
    // Returns all entries sorted by date
    const entries = getEntriesFromLocalStorage();
    return entries
        .sort((a, b) => b.date.localeCompare(a.date));
}
