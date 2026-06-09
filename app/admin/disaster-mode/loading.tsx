import AppHeader from "@/components/AppHeader";

function Block({ h = "h-32" }: { h?: string }) {
  return <div className={`bg-white rounded-xl border border-gray-200 ${h} animate-pulse`} />;
}

export default function DisasterModeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="災害時モード切替" backHref="/admin" variant="admin" showLogout />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        <Block h="h-24" />
        <Block h="h-40" />
        <Block h="h-28" />
        <Block h="h-20" />
      </div>
    </div>
  );
}
