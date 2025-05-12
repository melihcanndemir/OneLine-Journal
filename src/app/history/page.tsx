import { Header } from "@/components/Header";
import { EntryCard } from "@/components/EntryCard";
import { getPastEntries } from "@/lib/actions";
import type { JournalEntry } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "History",
};

export default async function HistoryPage() {
  const entries: JournalEntry[] = await getPastEntries();

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Your Journal History</h1>
            <p className="text-muted-foreground mt-2">A look back at your daily thoughts.</p>
          </div>
          <Separator />
          {entries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-muted-foreground">No entries yet.</p>
              <p className="mt-2">Start writing your first sentence on the "Today" page!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </main>
       <footer className="py-6 md:px-8 md:py-0 border-t mt-auto">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Reflect on your journey.
          </p>
        </div>
      </footer>
    </>
  );
}

//
