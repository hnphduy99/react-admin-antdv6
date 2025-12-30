import { Loading } from "@/components/common/Loading/Loading";
import React, { Suspense } from "react";

export const withLoading = <T extends object>(Component: React.ComponentType<T>) => {
  return (props: T) => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
};
