"use client";

import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Eye,
  BarChart3,
  Megaphone,
  FileText,
  Lock,
  Wifi,
  Bluetooth,
  Battery,
  Palette,
  Sliders,
} from "lucide-react";
import { useDoubleCheck } from "@/context/DoubleCheckProvider";
import { DeviceStage } from "@/components/device/DeviceStage";
import { DeviceSwitcher } from "@/components/device/DeviceSwitcher";
import { MacWindow, type MacSidebarItem } from "@/components/device/MacWindow";
import { IPhoneShell } from "@/components/device/IPhoneShell";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsGroup } from "@/components/settings/SettingsGroup";

function PrivacySecurityDetail({ onOpenDoubleCheck }: { onOpenDoubleCheck: () => void }) {
  return (
    <div className="px-5 py-5">
      <h1 className="mb-4 px-1 text-[22px] font-bold" style={{ color: "var(--ios-label)" }}>
        Privacy &amp; Security
      </h1>

      <SettingsGroup>
        <SettingsRow
          icon={<ShieldCheck size={17} color="#fff" strokeWidth={2.2} />}
          iconBg="linear-gradient(135deg, #8e8e93, #48484a)"
          title="DoubleCheck"
          subtitle="Protect sensitive info as you type"
          isNew
          onClick={onOpenDoubleCheck}
        />
      </SettingsGroup>

      <SettingsGroup footer="Apps must ask permission to use the following services on your device.">
        <SettingsRow
          icon={<MapPin size={17} color="#fff" strokeWidth={2.2} />}
          iconBg="linear-gradient(135deg, #5ac8fa, #007aff)"
          title="Location Services"
          subtitle="On"
        />
        <SettingsRow
          icon={<Eye size={17} color="#fff" strokeWidth={2.2} />}
          iconBg="linear-gradient(135deg, #ff9500, #ff5e00)"
          title="Tracking"
        />
        <SettingsRow
          icon={<BarChart3 size={17} color="#fff" strokeWidth={2.2} />}
          iconBg="linear-gradient(135deg, #8e8e93, #48484a)"
          title="Analytics & Improvements"
        />
        <SettingsRow
          icon={<Megaphone size={17} color="#fff" strokeWidth={2.2} />}
          iconBg="linear-gradient(135deg, #5856d6, #3634a3)"
          title="Apple Advertising"
        />
        <SettingsRow
          icon={<FileText size={17} color="#fff" strokeWidth={2.2} />}
          iconBg="linear-gradient(135deg, #64d2ff, #0a84ff)"
          title="App Privacy Report"
        />
        <SettingsRow
          icon={<Lock size={17} color="#fff" strokeWidth={2.2} />}
          iconBg="linear-gradient(135deg, #ff453a, #ba1a0f)"
          title="Lockdown Mode"
          subtitle="Off"
        />
      </SettingsGroup>
    </div>
  );
}

export default function EnterPage() {
  const router = useRouter();
  const { onboardingComplete } = useDoubleCheck();

  const handleOpenDoubleCheck = () => {
    router.push(onboardingComplete ? "/extend" : "/onboarding");
  };

  const macSidebar: MacSidebarItem[] = [
    { id: "wifi", label: "Wi-Fi", icon: <Wifi size={13} strokeWidth={2.4} />, iconBg: "#007aff" },
    { id: "bluetooth", label: "Bluetooth", icon: <Bluetooth size={13} strokeWidth={2.4} />, iconBg: "#007aff" },
    { id: "battery", label: "Battery", icon: <Battery size={13} strokeWidth={2.4} />, iconBg: "#34c759" },
    { id: "appearance", label: "Appearance", icon: <Palette size={13} strokeWidth={2.4} />, iconBg: "#8e8e93" },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: <ShieldCheck size={13} strokeWidth={2.4} />,
      iconBg: "#5856d6",
      active: true,
    },
    { id: "general", label: "General", icon: <Sliders size={13} strokeWidth={2.4} />, iconBg: "#8e8e93" },
  ];

  return (
    <main className="h-dvh overflow-hidden" style={{ background: "var(--ios-background-secondary)" }}>
      <DeviceSwitcher />
      <DeviceStage
        mac={
          <MacWindow windowTitle="Privacy & Security" sidebarItems={macSidebar} onBack={() => router.back()}>
            <PrivacySecurityDetail onOpenDoubleCheck={handleOpenDoubleCheck} />
          </MacWindow>
        }
        iphone={
          <IPhoneShell title="Privacy & Security" onBack={() => router.back()}>
            <PrivacySecurityDetail onOpenDoubleCheck={handleOpenDoubleCheck} />
          </IPhoneShell>
        }
      />
    </main>
  );
}
