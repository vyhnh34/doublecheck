"use client";

import { useRouter } from "next/navigation";
import { DeviceStage } from "@/components/device/DeviceStage";
import { VersionSwitcher } from "@/components/device/VersionSwitcher";
import { MacWindow } from "@/components/device/MacWindow";
import { IPhoneShell } from "@/components/device/IPhoneShell";
import { DoubleCheckSettingsPage } from "@/components/settings/DoubleCheckSettingsPage";

export default function ExtendPage() {
  const router = useRouter();
  const content = <DoubleCheckSettingsPage />;

  return (
    <main className="h-dvh overflow-hidden" style={{ background: "var(--ios-background-secondary)" }}>
      <VersionSwitcher />
      <DeviceStage
        mac={
          <MacWindow windowTitle="DoubleCheck" onBack={() => router.back()} onClose={() => router.push("/engage")}>
            {content}
          </MacWindow>
        }
        iphone={
          <IPhoneShell title="DoubleCheck" onBack={() => router.back()} onSwipeHome={() => router.push("/engage")}>
            {content}
          </IPhoneShell>
        }
      />
    </main>
  );
}
