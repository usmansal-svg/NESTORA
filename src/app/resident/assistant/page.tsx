"use client";
import { useQuery } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/kit";
import { Assistant } from "@/components/shared/assistant";
import { Badge } from "@/components/ui/badge";

export default function AssistantPage() {
  const q = useQuery("q");
  return (
    <div className="flex h-[calc(100dvh-110px)] flex-col lg:h-dvh lg:pb-6">
      <PageHeader back title="Nestora AI" subtitle="Your building assistant" actions={<Badge variant="lime">EN · اردو · Roman</Badge>} className="mb-2" />
      <Assistant initial={q} className="mx-auto w-full max-w-3xl flex-1" />
    </div>
  );
}
