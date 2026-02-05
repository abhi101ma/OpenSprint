import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("rounded-lg border bg-white p-4 shadow-sm", props.className)} />;
}
