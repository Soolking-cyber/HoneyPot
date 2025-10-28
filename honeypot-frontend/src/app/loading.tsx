import { BeeLoader } from "@/components/ui/bee-loader";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05040a]">
      <BeeLoader message="Spinning up the hive..." />
    </div>
  );
}

