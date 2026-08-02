"use client";

import { useRouter } from "next/navigation";
import { DeviceStage } from "@/components/device/DeviceStage";
import { DeviceSwitcher } from "@/components/device/DeviceSwitcher";
import { MacWindow } from "@/components/device/MacWindow";
import { IPhoneShell } from "@/components/device/IPhoneShell";
import { DoubleCheckSettingsPage } from "@/components/settings/DoubleCheckSettingsPage";

export default function ExtendPage() {
  const router = useRouter();
  const content = <DoubleCheckSettingsPage />;

  return (
    <main className="h-dvh overflow-hidden" style={{ background: "var(--ios-background-secondary)" }}>
      <DeviceSwitcher />
      <DeviceStage
        mac={
          <MacWindow windowTitle="DoubleCheck" onBack={() => router.back()}>
            {content}
          </MacWindow>
        }
        iphone={
          <IPhoneShell title="DoubleCheck" onBack={() => router.back()}>
            {content}
          </IPhoneShell>
        }
      />
    </main>
  );
}
