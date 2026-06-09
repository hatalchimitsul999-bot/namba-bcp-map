import { fetchNotifications } from "@/lib/db/notifications";
import NotificationsView from "./NotificationsView";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const { data: notifications, error: fetchError } = await fetchNotifications();
  return (
    <NotificationsView
      notifications={notifications ?? []}
      fetchError={fetchError}
    />
  );
}
