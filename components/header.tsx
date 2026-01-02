'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
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
                  <NavigationMenuLink asChild>
                    <Link href="/about" className="flex-row items-center">
                      <FileStackIcon />
                      About
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/cli" className="flex-row items-center">
                      <TerminalIcon />
                      CLI
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/security" className="flex-row items-center">
                      <ShieldCheckIcon />
                      Security
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
