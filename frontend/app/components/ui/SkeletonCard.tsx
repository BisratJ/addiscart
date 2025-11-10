'use client';

import { cn } from "@/app/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}>
      {/* Image placeholder */}
      <div className="w-full h-40 bg-gray-200 animate-pulse" />
      
      {/* Content placeholders */}
      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse" />
        
        {/* Description placeholder - two lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse" />
        </div>
        
        {/* Rating and price placeholder */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
            <div className="w-8 h-4 bg-gray-200 rounded-md ml-1 animate-pulse" />
          </div>
          <div className="w-16 h-4 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProductCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="w-16 h-16 rounded-md bg-gray-200 mr-4 animate-pulse" />
      <div className="flex-grow">
        <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse" />
      </div>
      <div className="w-12 h-5 bg-gray-200 rounded-md animate-pulse" />
    </div>
  );
}
