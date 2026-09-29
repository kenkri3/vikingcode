"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Loader2,
  Code,
  Terminal,
  Zap,
  Clock,
  ArrowLeft,
  ArrowRight,
  Lock,
  ChevronDown,
  Check,
  Plus,
  X,
  FilePlus,
} from "lucide-react";
import { ProjectFile } from "@/lib/types";
import { getProjectPageRoutes, generatePageTemplate } from "@/lib/page-routes";
import { AgentWorkingHUD } from "./AgentWorkingHUD";

interface LivePreviewProps {
  files: ProjectFile[];
  projectName: string;
  isGenerating?: boolean;
  onSwitchToCode?: () => void;
  onCreateNewPage?: (path: string, content: string) => void;
  onSelectFile?: (path: string) => void;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

// Pre-process code in pure TypeScript outside template literal so regexes are never corrupted
function prepareComponentCode(rawCode: string) {
  if (!rawCode || !rawCode.trim()) {
    return { code: "", compName: "App" };
  }

  // 1. Extract all icons imported from 'lucide-react'
  const importedIcons: string[] = [];
  const lucideRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/g;
  let match: RegExpExecArray | null;
  while ((match = lucideRegex.exec(rawCode)) !== null) {
    const names = match[1]
      .split(",")
      .map((s) => s.trim().replace(/^type\s+/, ""))
      .filter((s) => s && /^[A-Za-z0-9_]+$/.test(s));
    importedIcons.push(...names);
  }

  let code = rawCode.replace(/\r\n/g, "\n");

  // 1.4 Strip stray markdown fences
  code = code.replace(/^```[a-zA-Z0-9_-]*\s*$/gm, "");
  code = code.replace(/```\s*$/g, "");

  // 2. Strip "use client"
  code = code.replace(/['"]use client['"];?/g, "");

  // 3. Strip all React imports
  code = code.replace(/import[\s\S]*?from\s*['"]react['"];?/g, "");

  // 4. Strip lucide-react imports
  code = code.replace(/import[\s\S]*?from\s*['"]lucide-react['"];?/g, "");

  // 5. Strip next/link, next/image, next/navigation and other next imports
  code = code.replace(/import[\s\S]*?from\s*['"]next\/[^'"]+['"];?/g, "");

  // 6. Strip any other external imports
  code = code.replace(/import\s+(?:type\s+)?[\s\S]*?from\s*['"][^'"]+['"];?/g, "");
  code = code.replace(/import\s*['"][^'"]+['"];?/g, "");

  // 7. Find component export name
  let compName = "App";
  const fnMatch = code.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
  if (fnMatch) {
    compName = fnMatch[1];
    code = code.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/, "function $1");
  } else {
    const varMatch = code.match(/export\s+default\s+([A-Za-z0-9_]+)/);
    if (varMatch) {
      compName = varMatch[1];
      code = code.replace(/export\s+default\s+[A-Za-z0-9_]+;?/, "");
    } else if (/export\s+default\s+function/.test(code)) {
      compName = "__DynamicDefaultApp";
      code = code.replace(/export\s+default\s+function/, "function __DynamicDefaultApp");
    }
  }

  // 8. Strip any remaining export keywords
  code = code.replace(/export\s+(?:const|let|var|function|type|interface)\s+/g, "");

  // 9. Prepend icon declarations if icons were imported
  const uniqueIcons = Array.from(new Set(importedIcons));
  const iconDeclarations =
    uniqueIcons.length > 0
      ? `const { ${uniqueIcons.join(", ")} } = window.__lucideProxy;\n`
      : "";

  return {
    code: iconDeclarations + code,
    compName,
  };
}

const ICON_SVGS: Record<string, string> = {
  Scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/>',
  ShoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  ShoppingCart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  Utensils: '<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 11v11"/><path d="M5 2v20"/><path d="M2 2h6v5a3 3 0 0 1-6 0V2z"/>',
  UtensilsCrossed: '<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>',
  Car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 12.8V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  Dumbbell: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
  CreditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  BadgeCheck: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  HeartPulse: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  Calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  Clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  User: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  Shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  ShieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  CheckCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  CheckCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  Check: '<path d="M20 6 9 17l-5-5"/>',
  Fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a10.97 10.97 0 0 1-5.5-1.93l-4 2 1-4.5c-1.3-.9-2.2-2.1-2.5-3.5.3-1.4 1.2-2.6 2.5-3.5L6.5 4.5l4 2c1.7-.8 3.5-1.2 5.5-1.2"/>',
  Anchor: '<circle cx="12" cy="5" r="3"/><line x1="12" x2="12" y1="22" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
  Waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  ChefHat: '<path d="M6 13.8a4 4 0 0 1-1.8-7.5A4.5 4.5 0 0 1 12 3a4.5 4.5 0 0 1 7.8 3.3A4 4 0 0 1 18 13.8"/><path d="M6 17h12a2 2 0 0 1 2 2v2H4v-2a2 2 0 0 1 2-2Z"/>',
  Wine: '<path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>',
  Coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Zm0 0h2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-2"/><path d="M6 2v2"/>',
  Flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  Video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  MapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  Pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  FileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  Phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  Sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
  Sparkle: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  ChevronRight: '<path d="m9 18 6-6-6-6"/>',
  ChevronLeft: '<path d="m15 18-6-6 6-6"/>',
  ChevronDown: '<path d="m6 9 6 6 6-6"/>',
  Activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  Award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  AlertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  Hammer: '<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 3.26-6.36 6.36a1 1 0 0 0-.29.71v3.38l-4 4"/><path d="m18 10 4-4"/>',
  Ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  Star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  Search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  Plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  Trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  Trash2: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  ArrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  ArrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  ExternalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  Copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  Send: '<line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  Mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  Globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  Building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  Building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  Home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  Compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  Moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  Info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  Menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  X: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  Lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Unlock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  Settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  TrendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  DollarSign: '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  Sliders: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/>',
  Eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  Camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  Image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  Package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  Truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18.5" r="2.5"/><circle cx="7" cy="18.5" r="2.5"/>',
};

export function LivePreview({
  files,
  projectName,
  isGenerating = false,
  onSwitchToCode,
  onCreateNewPage,
  onSelectFile,
}: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [isHudActive, setIsHudActive] = useState(isGenerating);

  useEffect(() => {
    if (isGenerating) setIsHudActive(true);
  }, [isGenerating]);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Kartlegg alle sider og ruter i prosjektet
  const pageRoutes = useMemo(() => getProjectPageRoutes(files), [files]);

  // 2. Rutehistorikk og navigasjonstilstand
  const [currentRoute, setCurrentRoute] = useState<string>("/");
  const [routeHistory, setRouteHistory] = useState<string[]>(["/"]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isRouteDropdownOpen, setIsRouteDropdownOpen] = useState(false);
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
  const [newPageInput, setNewPageInput] = useState("");

  // Klargjør kode for ALLE sider i prosjektet
  const preparedPages = useMemo(() => {
    return pageRoutes.map((p) => {
      const { code, compName } = prepareComponentCode(p.rawCode);
      return {
        route: p.route,
        title: p.title,
        path: p.path,
        code,
        compName,
      };
    });
  }, [pageRoutes]);

  // Beregn hash for kildekoden for å garantere fresh remount av sandkassen ved kodeendring
  const contentHash = useMemo(() => {
    let hash = 0;
    const combined = preparedPages.map((p) => p.route + p.code).join("::");
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }, [preparedPages]);

  // Lytt etter navigasjonsmeldinger fra sandkasse-iframen (f.eks. ved klikk på <Link href="/booking">)
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "PREVIEW_ROUTE_CHANGED" && typeof event.data.route === "string") {
        const newRoute = event.data.route;
        setCurrentRoute(newRoute);
        setRouteHistory((prev) => {
          if (prev[prev.length - 1] === newRoute) return prev;
          const next = [...prev.slice(0, historyIndex + 1), newRoute];
          setHistoryIndex(next.length - 1);
          return next;
        });
      }
    };

    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener("message", handleWindowMessage);
  }, [historyIndex]);

  // Navigasjonshåndterere for adressebaren
  const handleNavigateToRoute = (targetRoute: string) => {
    setCurrentRoute(targetRoute);
    setRouteHistory((prev) => {
      const next = [...prev.slice(0, historyIndex + 1), targetRoute];
      setHistoryIndex(next.length - 1);
      return next;
    });
    setIsRouteDropdownOpen(false);
    iframeRef.current?.contentWindow?.postMessage(
      { type: "NAVIGATE_TO_ROUTE", route: targetRoute },
      "*"
    );
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const prevRoute = routeHistory[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentRoute(prevRoute);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "NAVIGATE_TO_ROUTE", route: prevRoute },
        "*"
      );
    }
  };

  const handleGoForward = () => {
    if (historyIndex < routeHistory.length - 1) {
      const nextRoute = routeHistory[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentRoute(nextRoute);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "NAVIGATE_TO_ROUTE", route: nextRoute },
        "*"
      );
    }
  };

  const handleCreateNewPageSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newPageInput.trim().replace(/^\/+/, "").toLowerCase();
    if (!clean) return;

    const { path, content } = generatePageTemplate(clean, projectName);
    if (onCreateNewPage) {
      onCreateNewPage(path, content);
    }
    setIsNewPageModalOpen(false);
    setNewPageInput("");
    handleNavigateToRoute("/" + clean);
  };

  // Bygg 100% dynamisk, interaktiv multi-page sandkasse-HTML basert på faktisk kildekode
  const iframeHtml = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="no" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} - Live Forhåndsvisning</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: { 500: '#7C3AED', 600: '#6D28D9' }
            }
          }
        }
      };
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.2/babel.min.js"></script>
    <style>
      body { background-color: #141414; color: #F9FAFB; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: #2e2e2e; border-radius: 9999px; }
      svg { display: inline-block; vertical-align: middle; max-width: 100%; flex-shrink: 0; }
      svg:not([class*="w-"]) { width: 1.25rem; }
      svg:not([class*="h-"]) { height: 1.25rem; }
    </style>
  </head>
  <body class="bg-[#141414] text-slate-100 min-h-screen">
    <div id="root">
      <div class="flex flex-col items-center justify-center min-h-[380px] p-6 text-slate-400 gap-3">
        <div class="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-mono text-slate-400">Kompilerer flersidig applikasjon...</p>
      </div>
    </div>

    <script>
      const ICON_SVGS = ${JSON.stringify(ICON_SVGS)};

      function createIcon(name) {
        return function IconComp(props) {
          const size = (props && props.size) || 20;
          let className = (props && props.className) || '';
          if (!className.includes('w-') && !className.includes('h-')) {
            className = (className + ' w-5 h-5').trim();
          }
          className = (className + ' shrink-0 inline-block').trim();

          const innerSvg = ICON_SVGS[name] || '<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>';
          return React.createElement('svg', {
            ...props,
            width: (props && props.width) || size,
            height: (props && props.height) || size,
            className: className,
            viewBox: '0 0 24 24',
            fill: (props && props.fill) || 'none',
            stroke: 'currentColor',
            strokeWidth: (props && props.strokeWidth) || '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            dangerouslySetInnerHTML: { __html: innerSvg }
          });
        };
      }

      window.__lucideProxy = new Proxy({}, {
        get: (target, prop) => createIcon(String(prop))
      });

      // Sandkasse Mock Fetch
      const origFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (typeof url === 'string' && url.includes('/api/')) {
          return new Response(JSON.stringify({
            success: true,
            status: 200,
            message: 'Sandkasse mock-respons',
            timestamp: new Date().toISOString()
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return origFetch(url, options);
      };

      // Toast notification helper inside sandbox
      function showSandboxToast(msg) {
        var existing = document.getElementById('__sandbox_toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.id = '__sandbox_toast';
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1c1c24;color:#f3f4f6;border:1px solid #7C3AED;padding:8px 18px;border-radius:9999px;font-size:12px;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,0.6);z-index:99999;transition:opacity 0.25s, transform 0.25s;pointer-events:none;';
        document.body.appendChild(toast);
        setTimeout(function() {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(-50%) translateY(8px)';
          setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
        }, 2200);
      }

      // Universal click interceptor: Håndterer interne ruter og forhindrer at iframe navigerer bort
      document.addEventListener('click', function(e) {
        var el = e.target;
        while (el && el !== document.body) {
          if (el.tagName === 'A') {
            var href = el.getAttribute('href') || '';
            e.preventDefault();
            e.stopPropagation();
            if (href.startsWith('#')) {
              var target = document.querySelector(href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            } else if (href.startsWith('http://') || href.startsWith('https://')) {
              window.open(href, '_blank', 'noopener,noreferrer');
            } else if (href) {
              if (window.__SANDBOX_NAVIGATE) {
                window.__SANDBOX_NAVIGATE(href);
              }
            }
            return;
          }
          el = el.parentElement;
        }
      }, true);

      // Universal form submit interceptor: Hindrer at innsending av skjema laster siden på nytt
      document.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSandboxToast('✓ Skjema innsendt (sandkasse-modus)');
      }, true);

      // Mock Next.js navigation & components
      const Link = (props) => {
        const { href, children, onClick, ...rest } = props;
        return React.createElement('a', {
          href: href || '#',
          onClick: (e) => {
            e.preventDefault();
            if (onClick) onClick(e);
            if (!href) return;
            if (href.startsWith('#')) {
              const target = document.querySelector(href);
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            } else if (href.startsWith('http://') || href.startsWith('https://')) {
              window.open(href, '_blank', 'noopener,noreferrer');
            } else {
              if (window.__SANDBOX_NAVIGATE) {
                window.__SANDBOX_NAVIGATE(href);
              }
            }
          },
          ...rest
        }, children);
      };

      const Image = (props) => React.createElement('img', { ...props, alt: props.alt || '' });

      const useRouter = () => ({
        push: (url) => { if (window.__SANDBOX_NAVIGATE) window.__SANDBOX_NAVIGATE(url); },
        replace: (url) => { if (window.__SANDBOX_NAVIGATE) window.__SANDBOX_NAVIGATE(url); },
        prefetch: () => {},
        back: () => { window.history.back(); },
        pathname: window.__CURRENT_ROUTE__ || '/',
        query: {}
      });
      const usePathname = () => window.__CURRENT_ROUTE__ || '/';
      const useSearchParams = () => new URLSearchParams();
      const redirect = (url) => { if (window.__SANDBOX_NAVIGATE) window.__SANDBOX_NAVIGATE(url); };

      const PAGES_DATA = ${JSON.stringify(preparedPages)};

      class ErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, error: null };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        componentDidCatch(error, errorInfo) {
          console.error('[React Sandbox Render Error]:', error, errorInfo);
        }
        render() {
          if (this.state.hasError) {
            return React.createElement('div', { className: 'p-6 max-w-xl mx-auto my-8 bg-[#1f1f1f] border border-amber-500/50 rounded-2xl text-slate-200' },
              React.createElement('h3', { className: 'text-sm font-bold text-amber-400 mb-2' }, '⚡ Kjøretidsfeil i forhåndsvisning'),
              React.createElement('p', { className: 'text-xs text-slate-400 mb-2' }, 'Komponenten støtte på en feil under rendering:'),
              React.createElement('pre', { className: 'p-3 bg-[#141414] text-amber-300 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap' }, String(this.state.error && (this.state.error.message || this.state.error)))
            );
          }
          return this.props.children;
        }
      }

      function runSandbox() {
        var rootEl = document.getElementById('root');
        if (!PAGES_DATA || PAGES_DATA.length === 0) {
          rootEl.innerHTML = '<div class="p-8 text-center text-slate-500 font-mono text-xs">Venter på kildekode...</div>';
          return;
        }

        try {
          if (typeof Babel === 'undefined') {
            throw new Error('Babel Standalone er ikke lastet inn.');
          }

          var PAGES_MAP = {};

          for (var i = 0; i < PAGES_DATA.length; i++) {
            var page = PAGES_DATA[i];
            try {
              var transpiled = null;
              try {
                transpiled = Babel.transform(page.code, {
                  presets: ['react', 'typescript'],
                  filename: page.path
                }).code;
              } catch (firstErr) {
                console.warn('[Babel Sandbox parse error in ' + page.path + ']:', firstErr);
                var errLine = (firstErr && firstErr.loc && firstErr.loc.line) || 0;
                if (errLine > 0) {
                  var lines = page.code.split(String.fromCharCode(10));
                  if (errLine <= lines.length) {
                    var bad = lines[errLine - 1];
                    if (bad.indexOf('<') !== -1 || bad.indexOf('>') !== -1) {
                      lines[errLine - 1] = '{/* ' + bad.replace(/[{}]/g, '') + ' */}';
                    } else {
                      lines[errLine - 1] = '// ' + bad;
                    }
                    transpiled = Babel.transform(lines.join(String.fromCharCode(10)), {
                      presets: ['react', 'typescript'],
                      filename: page.path
                    }).code;
                  } else {
                    throw firstErr;
                  }
                } else {
                  throw firstErr;
                }
              }

              var execFn = new Function(
                'React', 'useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useId', 'Fragment', 'Link', 'Image', 'useRouter', 'usePathname', 'useSearchParams', 'redirect',
                transpiled + String.fromCharCode(10) + 'return typeof ' + page.compName + ' !== "undefined" ? ' + page.compName + ' : (typeof App !== "undefined" ? App : null);'
              );

              PAGES_MAP[page.route] = execFn(
                React,
                React.useState,
                React.useEffect,
                React.useMemo,
                React.useCallback,
                React.useRef,
                React.useId,
                React.Fragment,
                Link,
                Image,
                useRouter,
                usePathname,
                useSearchParams,
                redirect
              );
            } catch (pageErr) {
              console.warn('[Kompileringsfeil for ' + page.path + ']:', pageErr);
              (function(p, err) {
                PAGES_MAP[p.route] = function ErrorPage() {
                  return React.createElement('div', { className: 'p-6 max-w-xl mx-auto my-8 bg-[#1f1f1f] border border-amber-500/50 rounded-2xl text-slate-200' },
                    React.createElement('h3', { className: 'text-sm font-bold text-amber-400 mb-2' }, '⚡ Feil under kompilering av ' + p.path),
                    React.createElement('pre', { className: 'p-3 bg-[#141414] text-amber-300 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap' }, String(err && (err.message || err)))
                  );
                };
              })(page, pageErr);
            }
          }

          // Flersidig Sandkasse-Router
          function SandboxRouter() {
            var initialRoute = ${JSON.stringify(currentRoute)} || '/';
            var [route, setRoute] = React.useState(initialRoute);
            window.__CURRENT_ROUTE__ = route;

            React.useEffect(function() {
              function onParentMessage(e) {
                if (e.data && e.data.type === 'NAVIGATE_TO_ROUTE' && typeof e.data.route === 'string') {
                  setRoute(e.data.route);
                  window.__CURRENT_ROUTE__ = e.data.route;
                  window.scrollTo(0, 0);
                }
              }
              window.addEventListener('message', onParentMessage);
              return function() {
                window.removeEventListener('message', onParentMessage);
              };
            }, []);

            window.__SANDBOX_NAVIGATE = function(targetUrl) {
              if (!targetUrl) return;
              var norm = targetUrl.trim();
              if (norm.indexOf('?') !== -1) norm = norm.split('?')[0];
              if (!norm.startsWith('/')) norm = '/' + norm;
              if (norm.length > 1 && norm.endsWith('/')) norm = norm.slice(0, -1);

              setRoute(norm);
              window.__CURRENT_ROUTE__ = norm;
              window.scrollTo(0, 0);
              try {
                window.parent.postMessage({ type: 'PREVIEW_ROUTE_CHANGED', route: norm }, '*');
              } catch(e) {}
            };

            var PageComponent = PAGES_MAP[route] || PAGES_MAP[route.toLowerCase()];

            if (!PageComponent) {
              return React.createElement('div', { className: 'min-h-[480px] flex flex-col items-center justify-center p-8 text-center text-slate-300 space-y-4' },
                React.createElement('div', { className: 'w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 font-bold text-2xl shadow-xl' }, '404'),
                React.createElement('h2', { className: 'text-xl font-bold text-white tracking-tight' }, 'Siden finnes ikke ennå'),
                React.createElement('p', { className: 'text-xs text-slate-400 max-w-md leading-relaxed' }, 'Ruten "' + route + '" er ikke opprettet i prosjektet ditt ennå. Du kan opprette den fra adressebaren over eller be AI Program Agent om å lage den.'),
                React.createElement('div', { className: 'flex items-center gap-3 pt-2' },
                  React.createElement('button', {
                    onClick: function() { window.__SANDBOX_NAVIGATE('/'); },
                    className: 'px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer shadow-lg'
                  }, '← Gå til forsiden')
                )
              );
            }

            return React.createElement(ErrorBoundary, null, React.createElement(PageComponent));
          }

          rootEl.innerHTML = '';
          var root = ReactDOM.createRoot(rootEl);
          root.render(React.createElement(SandboxRouter));
        } catch (err) {
          console.error('[Sandbox Router Error]:', err);
          var errMsg = err && err.message ? err.message : String(err);
          rootEl.innerHTML = '<div class="p-6 max-w-2xl mx-auto my-8 bg-[#1f1f1f] border border-amber-500/40 rounded-2xl shadow-2xl space-y-4">' +
            '<div class="flex items-center gap-3 text-amber-400">' +
              '<span class="text-xl">⚡</span>' +
              '<h3 class="font-bold text-sm">Flersidig React-sandkasse</h3>' +
            '</div>' +
            '<p class="text-xs text-slate-300 leading-relaxed">' +
              'Det oppsto en feil under oppstart av forhåndsvisningen:' +
              '<code class="block mt-2 p-3 bg-[#141414] text-amber-300 font-mono text-[11px] rounded-xl border border-amber-900/50 overflow-x-auto whitespace-pre-wrap">' + errMsg + '</code>' +
            '</p>' +
            '<div class="pt-2 border-t border-[#2e2e2e] flex items-center justify-between">' +
              '<span class="text-[11px] text-slate-400">Next.js 15 Sandkasse</span>' +
              '<button onclick="location.reload()" class="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl cursor-pointer">' +
                'Last inn på nytt' +
              '</button>' +
            '</div>' +
          '</div>';
        }
      }

      function initSandbox() {
        var attempts = 0;
        function checkAndRun() {
          if (typeof Babel !== 'undefined' && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
            runSandbox();
            return true;
          }
          return false;
        }

        if (!checkAndRun()) {
          var interval = setInterval(function() {
            attempts++;
            if (checkAndRun()) {
              clearInterval(interval);
            } else if (attempts >= 100) {
              clearInterval(interval);
              runSandbox();
            }
          }, 80);
        }
      }

      initSandbox();
    </script>
  </body>
</html>`;
  }, [preparedPages, currentRoute, projectName]);

  const deviceWidths: Record<DeviceMode, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const handlePopout = () => {
    const blob = new Blob([iframeHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const quickPagePresets = [
    { label: "Timebestilling", route: "booking" },
    { label: "Kontakt oss", route: "kontakt" },
    { label: "Om oss", route: "om-oss" },
    { label: "Priser & Tjenester", route: "priser" },
    { label: "Adminpanel", route: "admin" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#121215] relative overflow-hidden">
      {/* Frame Container */}
      <div className="flex-1 p-2 sm:p-3 flex items-start justify-center overflow-auto bg-[#121215]">
        <div
          className="h-full w-full border border-[#26262e] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 bg-[#16161c] flex flex-col"
          style={{ width: isGenerating ? "100%" : deviceWidths[device], maxWidth: "100%" }}
        >
          {isHudActive ? (
            <AgentWorkingHUD
              projectName={projectName}
              files={files}
              isGenerating={isGenerating}
              onComplete={() => setIsHudActive(false)}
              onSwitchToCode={onSwitchToCode}
            />
          ) : (
            <>
              {/* Mini-Browser Address Bar & Route Navigator */}
              <div className="h-10 bg-[#171722] border-b border-[#252532] px-3 flex items-center justify-between gap-2 select-none shrink-0 z-30">
                {/* Left: Back / Forward / Reload Navigation */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={historyIndex <= 0}
                    onClick={handleGoBack}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252532] disabled:opacity-25 disabled:pointer-events-none transition cursor-pointer"
                    title="Gå tilbake"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={historyIndex >= routeHistory.length - 1}
                    onClick={handleGoForward}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252532] disabled:opacity-25 disabled:pointer-events-none transition cursor-pointer"
                    title="Gå frem"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252532] transition cursor-pointer"
                    title="Last inn på nytt"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Center: Address Bar with Route Dropdown Selector */}
                <div className="flex-1 max-w-md mx-auto relative">
                  <div
                    onClick={() => setIsRouteDropdownOpen(!isRouteDropdownOpen)}
                    className="flex items-center justify-between gap-2 px-3 py-1 bg-[#101016] hover:bg-[#15151e] border border-[#2a2a38] rounded-lg text-xs font-mono cursor-pointer transition shadow-inner group"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="text-slate-500">https://</span>
                      <span className="text-slate-300 font-semibold truncate">
                        {(projectName || "app").toLowerCase().replace(/[^a-z0-9]/g, "-")}.aiprogram.site
                      </span>
                      <span className="text-purple-400 font-bold">{currentRoute}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-300 group-hover:text-white bg-[#20202c] px-1.5 py-0.5 rounded font-sans font-medium">
                        {pageRoutes.find((r) => r.route === currentRoute)?.title || "Side"}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>

                  {/* Route Dropdown Menu */}
                  {isRouteDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsRouteDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1a1a26] border border-[#2e2e42] rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in duration-100 space-y-1">
                        <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                          <span>Sider i prosjektet ({pageRoutes.length})</span>
                          <span className="text-[9px] text-purple-400 font-mono">Next.js App Router</span>
                        </div>

                        <div className="max-h-52 overflow-y-auto space-y-0.5">
                          {pageRoutes.map((pr) => (
                            <button
                              key={pr.route}
                              type="button"
                              onClick={() => handleNavigateToRoute(pr.route)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                                currentRoute === pr.route
                                  ? "bg-purple-600/30 text-white font-medium border border-purple-500/40"
                                  : "text-slate-300 hover:bg-[#252536] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-purple-400 font-mono text-[11px] font-bold">
                                  {pr.route}
                                </span>
                                <span className="text-slate-400 text-[11px]">
                                  ({pr.title})
                                </span>
                              </div>
                              {currentRoute === pr.route && (
                                <Check className="w-3 h-3 text-purple-400 shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="pt-1.5 mt-1 border-t border-[#262638]">
                          <button
                            type="button"
                            onClick={() => {
                              setIsRouteDropdownOpen(false);
                              setIsNewPageModalOpen(true);
                            }}
                            className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-left text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 transition cursor-pointer font-medium"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Opprett ny underside...</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Right: Device Switcher + Popout Window Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center bg-[#101016] border border-[#2a2a38] rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setDevice("desktop")}
                      className={`p-1 rounded-md transition cursor-pointer ${
                        device === "desktop"
                          ? "bg-[#252538] text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                      title="Desktop (100%)"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDevice("tablet")}
                      className={`p-1 rounded-md transition cursor-pointer ${
                        device === "tablet"
                          ? "bg-[#252538] text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                      title="Nettbrett (768px)"
                    >
                      <Tablet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDevice("mobile")}
                      className={`p-1 rounded-md transition cursor-pointer ${
                        device === "mobile"
                          ? "bg-[#252538] text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                      title="Mobil (375px)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-px h-3.5 bg-[#252532] mx-0.5" />

                  <button
                    type="button"
                    onClick={handlePopout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252532] transition cursor-pointer"
                    title="Åpne i nytt vindu"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Iframe Viewport */}
              <div className="flex-1 w-full h-full relative overflow-hidden bg-[#141414]">
                <iframe
                  ref={iframeRef}
                  key={`${reloadKey}-${contentHash}`}
                  srcDoc={iframeHtml}
                  title="AI Program Live Sandbox Preview"
                  className="w-full h-full border-none min-h-[500px]"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal: Opprett ny underside */}
      {isNewPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#16161e] border border-[#2a2a3a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252534]">
              <div className="flex items-center gap-2">
                <FilePlus className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Opprett ny underside</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPageModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#242432] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Opprett en ny underside i Next.js App Router (f.eks. <code>app/booking/page.tsx</code>). Siden vil automatisk bli tilgjengelig i forhåndsvisningen.
            </p>

            {/* Quick Presets */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Velg et vanlig sideoppsett:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickPagePresets.map((qp) => (
                  <button
                    key={qp.route}
                    type="button"
                    onClick={() => setNewPageInput(qp.route)}
                    className="px-2.5 py-1 rounded-lg bg-[#20202c] hover:bg-[#282838] border border-[#2c2c3c] text-xs text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateNewPageSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Rutenavn / Mappe:
                </label>
                <div className="flex items-center gap-1.5 bg-[#0e0e14] border border-[#2c2c3e] rounded-xl px-3 py-2 text-xs">
                  <span className="text-slate-500 font-mono">app/</span>
                  <input
                    type="text"
                    required
                    value={newPageInput}
                    onChange={(e) => setNewPageInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="booking"
                    className="bg-transparent text-white font-mono outline-none flex-1"
                    autoFocus
                  />
                  <span className="text-slate-500 font-mono">/page.tsx</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPageModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#20202a] hover:bg-[#282836] text-xs text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={!newPageInput.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-semibold text-white transition cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  Opprett og åpne side
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
