import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { APPS } from "@/data/apps";
import { ClaudeMark, ChatGPTMark } from "@/components/icons/ProductMarks";

export const DOCK_IDS = ["messages", "browser", "claude", "chatgpt"];

const GLYPHS: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  messages: MessageCircle,
  claude: (p) => <ClaudeMark size={p.size} className="text-white" style={{ color: p.color }} />,
  chatgpt: (p) => <ChatGPTMark size={p.size} style={{ color: "#0d0d0d" }} />,
};

export function AppIcon({ appId, size = 58 }: { appId: string; size?: number }) {
  const app = APPS.find((a) => a.id === appId);
  if (!app) return null;

  const tileStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: size * 0.222,
    boxShadow: "0 1px 1px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.28)",
  };

  if (app.iconImage) {
    return (
      <span className="relative grid flex-shrink-0 place-items-center overflow-hidden" style={tileStyle}>
        <Image src={app.iconImage} alt={app.name} width={size} height={size} draggable={false} className="h-full w-full object-cover" />
      </span>
    );
  }

  const Glyph = GLYPHS[app.glyph];

  return (
    <span
      className="relative grid flex-shrink-0 place-items-center overflow-hidden"
      style={{
        ...tileStyle,
        background: `linear-gradient(160deg, rgba(255,255,255,0.25), rgba(255,255,255,0) 45%), ${app.color}`,
      }}
    >
      <Glyph size={size * 0.5} color="#fff" strokeWidth={1.8} />
    </span>
  );
}
