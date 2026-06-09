import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import DisasterModeForm from "./DisasterModeForm";

export const dynamic = "force-dynamic";

export default async function DisasterModePage() {
  const { data: event, error: fetchError } = await fetchActiveDisasterEvent();

  return <DisasterModeForm event={event} fetchError={fetchError} />;
}
