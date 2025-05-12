export interface JournalEntry {
  id: string;
  date: string; // Format: YYYY-MM-DD
  sentence: string;
  userId: string; // To associate entries with users in a real app
}
