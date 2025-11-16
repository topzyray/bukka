import { UserOrderDetails } from "@/features/dashboard/user/user-order-details";

export default function rderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = Number(params.id);
  return <UserOrderDetails orderId={orderId} />;
}
