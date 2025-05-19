import { Skeleton } from "./ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="w-full sm:w-32 h-32" />
        <div className="flex-1 p-4 sm:p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      {Array(columns)
        .fill(null)
        .map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${
              i === 0 ? "w-1/4" : i === columns - 1 ? "w-16" : "w-1/5"
            }`}
          />
        ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3">
      {Array(rows)
        .fill(null)
        .map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
    </div>
  );
}

// New skeleton components for Profile, Orders, and SellerForm

export function ProfileSkeleton() {
  return (
    <div className="w-screen min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-8 w-36 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-28 mt-4 md:mt-0" />
          </div>

          {/* Tabs skeleton */}
          <div className="flex border-b mb-6">
            <Skeleton className="h-10 w-24 mx-2" />
            <Skeleton className="h-10 w-32 mx-2" />
            <Skeleton className="h-10 w-28 mx-2" />
          </div>
        </div>

        {/* Profile info skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto mb-6" />

              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrdersSkeleton() {
  return (
    <div className="w-screen min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* Filters and search skeleton */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-24 flex-shrink-0" />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Orders list skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center gap-2 mb-2 md:mb-0">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-5 w-24" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-28 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SellerFormSkeleton() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-12 pb-20">
        {/* Header skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-full max-w-lg mx-auto" />
        </div>

        {/* Progress steps skeleton */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <Skeleton className="h-10 w-10 rounded-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Form skeleton */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
          <div className="p-8">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-40 w-full rounded-md" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-8">
      {/* Order header skeleton */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      </div>

      {/* Order details skeleton */}
      <div className="mb-8">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
          <div className="p-6">
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-gray-200"
                >
                  <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                    <Skeleton className="h-5 w-full max-w-md mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 mt-2 sm:mt-0">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex justify-between font-bold">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address and payment info skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <Skeleton className="h-5 w-36 mb-3" />
            <Skeleton className="h-4 w-full max-w-xs mb-2" />
            <Skeleton className="h-4 w-full max-w-sm mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div>
          <Skeleton className="h-7 w-32 mb-4" />
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <Skeleton className="h-5 w-36 mb-3" />
            <Skeleton className="h-4 w-full max-w-sm mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
