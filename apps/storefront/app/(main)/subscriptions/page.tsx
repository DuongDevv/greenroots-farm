import { SubscriptionBuilder } from "@/features/subscriptions/components/subscription-builder";
import { getSubscriptionPlans } from "@/services/subscription.service";

export default function SubscriptionsPage() {
  const plans = getSubscriptionPlans();

  return (
    <div className="mx-auto max-w-7xl px-3 pt-38 pb-12 lg:px-4 lg:pt-31">
      <SubscriptionBuilder plans={plans} />
    </div>
  );
}
