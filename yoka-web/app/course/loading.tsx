import React from "react";

const Loading = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 mb-6 animate-pulse">
        <div className="h-4 w-12 bg-muted rounded" />
        <div className="h-4 w-4 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
      </div>

      <div className="animate-pulse flex flex-col gap-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="h-10 w-3/4 md:w-1/2 bg-muted rounded-lg" />
          <div className="h-6 w-full md:w-2/3 bg-muted rounded-lg" />
        </div>

        {/* Banner */}
        <div className="w-full aspect-video md:h-[400px] bg-muted rounded-xl" />

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-[90%] bg-muted rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-[95%] bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="h-[300px] w-full bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="h-6 w-1/3 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
