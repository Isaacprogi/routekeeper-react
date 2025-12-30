import { ReactNode, ReactElement} from "react";

import React from "react";
export function devWarn(message: string) {
  if (process.env.NODE_ENV === "development") {
    console.warn(message);
    throw new Error(message);
  } else {
    console.warn(message);
  }
}


export function isLazyElement(node: ReactNode): node is ReactElement {
  return (
    React.isValidElement(node) && 
    typeof node.type === "function" && 
    (node.type as any).$$typeof === Symbol.for("react.lazy")
  );
}


