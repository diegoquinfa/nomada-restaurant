// @blossom-carousel/react points "types" at dist/src/index.d.ts, which is not published
// (the real file is dist/index.d.ts), so TypeScript cannot resolve it. Declare the subset we use.
declare module "@blossom-carousel/react" {
  import type {
    ElementType,
    ForwardRefExoticComponent,
    HTMLAttributes,
    ReactNode,
    RefAttributes,
  } from "react";

  export interface BlossomCarouselHandle {
    prev: (options?: { behavior?: ScrollBehavior }) => void;
    next: (options?: { behavior?: ScrollBehavior }) => void;
    goTo: (index: number, options?: { behavior?: ScrollBehavior }) => void;
    element: HTMLElement | null;
  }

  export interface BlossomCarouselProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
    as?: ElementType;
    repeat?: boolean;
    load?: "always" | "conditional";
  }

  export const BlossomCarousel: ForwardRefExoticComponent<
    BlossomCarouselProps & RefAttributes<BlossomCarouselHandle>
  >;
}
