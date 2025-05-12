// src/lib/actions.ts
"use server";

import type { JournalEntry } from './types';
import { format } from 'date-fns';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// In-memory store for demonstration purposes
// In a real app, this would be a database like Firebase Firestore.
let journalEntriesDB: JournalEntry[] = [
  { id: '1', date: format(new Date(Date.now() - 86400000 * 2), 'yyyy-MM-dd'), sentence: 'The journey of a thousand miles begins with a single step.', userId: 'mockUser' },
  { id: '2', date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'), sentence: 'Embraced the quiet moments today.', userId: 'mockUser' },
];

const MOCK_USER_ID = "mockUser"; // Simulate a logged-in user

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

export async function addEntry(prevState: FormState, formData: FormData): Promise<FormState> {
    const todayString = format(new Date(), 'yyyy-MM-dd');
    
    const existingEntry = journalEntriesDB.find(entry => entry.date === todayString && entry.userId === MOCK_USER_ID);
    if (existingEntry) {
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

    const newEntry: JournalEntry = {
        id: Date.now().toString(), // Simple ID generation
        date: todayString,
        sentence,
        userId: MOCK_USER_ID,
    };
    journalEntriesDB.push(newEntry);
    journalEntriesDB.sort((a, b) => b.date.localeCompare(a.date)); // Keep sorted by date descending
    
    revalidatePath('/');
    revalidatePath('/history');

    return { success: true, message: "Entry added successfully!", entry: newEntry };
}

export async function getTodaysEntry(): Promise<JournalEntry | null> {
    const todayString = format(new Date(), 'yyyy-MM-dd');
    const entry = journalEntriesDB.find(e => e.date === todayString && e.userId === MOCK_USER_ID);
    return entry || null;
}

export async function getPastEntries(): Promise<JournalEntry[]> {
    // Returns all entries sorted by date
    return journalEntriesDB
        .filter(entry => entry.userId === MOCK_USER_ID)
        .sort((a, b) => b.date.localeCompare(a.date));
}
