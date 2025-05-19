import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border rounded-xl overflow-hidden">
      <Button
        variant="ghost"
        className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-none"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold">Description</h2>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-slate-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500" />
        )}
      </Button>

      {expanded && (
        <div className="p-6">
          <p className="text-slate-700 leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}
