'use client';

import Link from 'next/link';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { useRef, Children, cloneElement, isValidElement } from 'react';

interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function AnimatedNavLink({ href, children }: AnimatedNavLinkProps) {
  const iconRef = useRef<AnimatedIconHandle>(null);

  // Find the icon element and clone it with the ref
  const childrenWithRef = Children.map(children, (child) => {
    // Assume the first valid element that's not a string is the icon
    if (isValidElement(child) && typeof child.type !== 'string') {
      return cloneElement(child as React.ReactElement<{ ref?: React.Ref<AnimatedIconHandle> }>, {
        ref: iconRef,
      });
    }
    return child;
  });

  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="flex-row items-center"
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        {childrenWithRef}
      </Link>
    </NavigationMenuLink>
  );
}
