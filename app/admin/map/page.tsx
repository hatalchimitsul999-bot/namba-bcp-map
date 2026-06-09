import AppHeader from "@/components/AppHeader";
import MapView from "./MapView";
import { fetchStores } from "@/lib/db/stores";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { fetchReportsByEventId } from "@/lib/db/reports";
import { fetchSupportRequestsByEventId } from "@/lib/db/supportRequests";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [storesResult, eventResult] = await Promise.all([
    fetchStores(),
    fetchActiveDisasterEvent(),
  ]);

  const stores = storesResult.data ?? [];
  const event = eventResult.data;
  const fetchError = storesResult.error ?? eventResult.error;

  const [reportsResult, supportResult] = event
    ? await Promise.all([
        fetchReportsByEventId(event.id),
        fetchSupportRequestsByEventId(event.id),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];

  const reports = reportsResult.data ?? [];
  const supportRequests = supportResult.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="BCPマップ" backHref="/admin" variant="admin" showLogout />
      <MapView
        stores={stores}
        reports={reports}
        supportRequests={supportRequests}
        event={event}
        fetchError={fetchError}
      />
    </div>
  );
}
