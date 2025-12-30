import React, { useState, ComponentType, ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

type WithRemoveErrorBoundaryProp = {
  setRemoveErrorBoundary: React.Dispatch<React.SetStateAction<boolean>>;
};

function withErrorBoundary<T extends object>(
  WrappedComponent: ComponentType<T>
) {
  return (props: T) => {
    const [removeErrorBoundary, setRemoveErrorBoundary] = useState(false);

    if (removeErrorBoundary) {
      return <WrappedComponent {...props} setRemoveErrorBoundary={setRemoveErrorBoundary} />;
    }

    return (
      <ErrorBoundary>
        <WrappedComponent {...props} setRemoveErrorBoundary={setRemoveErrorBoundary} />
      </ErrorBoundary>
    );
  };
}

export default withErrorBoundary;
