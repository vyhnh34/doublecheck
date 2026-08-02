export type ProductTheme = "claude" | "chatgpt";

export interface AppDef {
  id: string;
  name: string;
  glyph: string; // icon key handled by HomeScreen
  color: string; // CSS gradient/background for the icon tile
  iconImage?: string; // when set, renders this image instead of the glyph+color tile
  kind: "messages" | "browser" | "chat" | "settings";
  accent?: string; // solid accent used for bubbles/send button (chat apps)
  bubbleRadius?: number; // px — differentiates chat app bubble shape
  iconShape?: "square" | "circle"; // differentiates the home-screen tile shape
  productTheme?: ProductTheme;
  modelLabel?: string;
  greeting?: string;
}

export const APPS: AppDef[] = [
  { id: "messages", name: "Messages", glyph: "messages", color: "linear-gradient(135deg, #34c759, #248a3d)", kind: "messages" },
  { id: "browser", name: "Safari", glyph: "browser", color: "linear-gradient(135deg, #5ac8fa, #007aff)", iconImage: "/app-icons/safari.png", kind: "browser" },
  {
    id: "claude",
    name: "Claude",
    glyph: "claude",
    color: "#da7756",
    kind: "chat",
    accent: "#da7756",
    bubbleRadius: 16,
    iconShape: "square",
    productTheme: "claude",
    modelLabel: "Sonnet 4.6",
    greeting: "How can I help you today?",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    glyph: "chatgpt",
    color: "#ffffff",
    kind: "chat",
    accent: "#0d0d0d",
    bubbleRadius: 20,
    iconShape: "square",
    productTheme: "chatgpt",
    modelLabel: "GPT-5.5",
    greeting: "What's on the agenda today?",
  },
  { id: "settings", name: "Settings", glyph: "settings", color: "linear-gradient(135deg, #8e8e93, #48484a)", iconImage: "/app-icons/settings.png", kind: "settings" },
];
