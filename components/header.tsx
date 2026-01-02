'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { AnimatedNavLink } from './animated-nav-link';
import { TerminalIcon } from './ui/terminal';
import { FileStackIcon } from './ui/file-stack';
import { ShieldCheckIcon } from './ui/shield-check';

export function Header() {
  return (
    <header className="flex items-center justify-between w-full">
      <Link href="/" className="text-base font-semibold hover:opacity-70 transition-opacity">
        woop
      </Link>
      <NavigationMenu className="-my-1.5">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-36">
                <li>
                  <AnimatedNavLink href="/about">
                    <FileStackIcon />
                    About
                  </AnimatedNavLink>
                </li>
                <li>
                  <AnimatedNavLink href="/cli">
                    <TerminalIcon />
                    CLI
                  </AnimatedNavLink>
                </li>
                <li>
                  <AnimatedNavLink href="/security">
                    <ShieldCheckIcon />
                    Security
                  </AnimatedNavLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
