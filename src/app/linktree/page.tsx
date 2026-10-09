import type { Metadata } from "next";
import { Linktree } from "@/components/linktree/Linktree";
import { linktreePage } from "@/lib/content";

export const metadata: Metadata = {
  title: linktreePage.title,
  description: linktreePage.description,
};

export default function LinktreePage() {
  return <Linktree />;
}
