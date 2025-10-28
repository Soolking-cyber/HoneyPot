import { BeeLoader } from "@/components/ui/bee-loader";

export default function AppLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 text-stone-100">
      <BeeLoader message="Syncing your Bee and HoneyPot data..." />
    </div>
  );
}

