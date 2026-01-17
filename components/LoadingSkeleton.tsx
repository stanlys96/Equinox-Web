interface LoadingSkeletonProps {
  fullHeight?: boolean;
}

export const LoadingSkeleton = ({ fullHeight }: LoadingSkeletonProps) => {
  return (
    <div className="w-full relative p-3">
      <div className={`max-w-md mx-auto ${fullHeight ? "h-256" : "h-128"} animate-pulse bg-gray-200 rounded-3xl`} />
    </div>
  );
}