import { fetchStores } from "@/lib/db/stores";
import UserForm from "./UserForm";

export default async function NewUserPage() {
  const { data: stores } = await fetchStores();
  return <UserForm stores={stores ?? []} />;
}
