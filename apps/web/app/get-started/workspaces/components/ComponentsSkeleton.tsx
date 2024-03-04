import { Skeleton } from "@ui/components/ui/skeleton";
import React from "react";

const ComponentsSkeleton = () => {
  return (
    <div className="grid gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex w-full items-stretched justify-between space-x-4"
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[250px] h-8" />
            <Skeleton className="w-[200px] h-4" />
          </div>
          <Skeleton className="w-[150px] h-12" />
        </div>
      ))}
    </div>
  );
};

export default ComponentsSkeleton;
