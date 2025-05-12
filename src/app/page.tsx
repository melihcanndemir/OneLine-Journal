import { DailyInput } from "@/components/DailyInput";
import { Header } from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-center">
          <DailyInput />
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built with 🗯️ OneLine – "1 Sentence a Day, Infinite Mind".
          </p>
        </div>
      </footer>
    </>
  );
}
