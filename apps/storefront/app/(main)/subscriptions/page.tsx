import { SubscriptionBuilder } from "@/features/subscriptions/components/subscription-builder";
import { getSubscriptionPlans } from "@/services/subscription.service";

export default function SubscriptionsPage() {
  const plans = getSubscriptionPlans();

  return (
    <div className="mx-auto max-w-screen-xl px-3 pt-[152px] pb-12 lg:px-4 lg:pt-[124px]">
      <SubscriptionBuilder plans={plans} />
    </div>
  );
}
