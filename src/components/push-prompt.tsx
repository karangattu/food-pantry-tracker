"use client";

import { usePushNotifications } from "@/hooks/use-push-notifications";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

export function PushPrompt() {
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (isLoading) {
    return <p className="text-sm text-gray-600">Checking notification support...</p>;
  }

  if (!isSupported) {
    return (
      <p className="text-sm text-gray-600">
        Push notifications are not supported in this browser.
      </p>
    );
  }

  if (isSubscribed) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-green-700">Notifications are enabled. You will receive alerts about expiring items.</p>
        <Button variant="outline" size="sm" onClick={unsubscribe}>
          <BellOff className="h-4 w-4 mr-2" />
          Disable Notifications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Enable push notifications to get alerts when items are about to expire.
      </p>
      <Button size="sm" onClick={subscribe}>
        <Bell className="h-4 w-4 mr-2" />
        Enable Notifications
      </Button>
    </div>
  );
}
