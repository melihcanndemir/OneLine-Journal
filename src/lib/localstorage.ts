// src/lib/localstorage.ts
import type { JournalEntry } from './types';
import { format } from 'date-fns';

const LOCAL_STORAGE_KEY = 'journalEntries';

// Helper function to get all entries from Local Storage
const getEntriesFromLocalStorage = (): JournalEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const entriesJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!entriesJson) {
    return [];
  }
  try {
    return JSON.parse(entriesJson) as JournalEntry[];
  } catch (error) {
    console.error("Error parsing journal entries from Local Storage:", error);
    return [];
  }
};

// Helper function to save all entries to Local Storage
const saveEntriesToLocalStorage = (entries: JournalEntry[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving journal entries to Local Storage:", error);
  }
};

export const saveEntryToLocalStorage = (entry: JournalEntry): void => {
  const entries = getEntriesFromLocalStorage();
  // Prevent adding duplicate entries for the same day (optional, depends on your logic)
  const existingIndex = entries.findIndex(e => e.date === entry.date && e.userId === entry.userId);
  if (existingIndex > -1) {
    // Optionally update or replace the existing entry
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  // Optional: Keep sorted by date descending
  entries.sort((a, b) => b.date.localeCompare(a.date));
  saveEntriesToLocalStorage(entries);
};

export const getTodaysEntryFromLocalStorage = (): JournalEntry | null => {
  const todayString = format(new Date(), 'yyyy-MM-dd');
  const entries = getEntriesFromLocalStorage();
  const entry = entries.find(e => e.date === todayString); // Assuming no userId for simplicity in local storage example
  return entry || null;
};

export const getAllEntriesFromLocalStorage = (): JournalEntry[] => {
  return getEntriesFromLocalStorage();
};