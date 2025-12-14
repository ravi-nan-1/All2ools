
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, Mail, Shield, FileText, Wrench } from 'lucide-react';
import { LanguageSwitcher } from '../tool-page/language-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Image from 'next/image';

export function Header() {
  const pathname = usePathname();
  const isToolPage = pathname.startsWith('/tools/');
  const slug = isToolPage ? pathname.split('/')[2] : '';

  const getNavLinks = () => {
    if (isToolPage && slug) {
      return [
        { href: `/tools/${slug}`, label: 'Tool Home', icon: Wrench },
        { href: `/tools/${slug}/about`, label: 'About', icon: Info },
        { href: `/tools/${slug}/contact`, label: 'Contact', icon: Mail },
        { href: `/tools/${slug}/privacy`, label: 'Privacy', icon: Shield },
        { href: `/tools/${slug}/terms`, label: 'Terms', icon: FileText },
      ];
    }
    return [
      { href: '/', label: 'Home', icon: Home },
      { href: '/about', label: 'About', icon: Info },
      { href: '/contact', label: 'Contact', icon: Mail },
      { href: '/privacy', label: 'Privacy', icon: Shield },
      { href: '/terms', label: 'Terms', icon: FileText },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <Image src="/logo.png" alt="All2ools Logo" width={24} height={24} className="h-6 w-6" />
          <span className="font-headline">All2ools</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="text-muted-foreground transition-colors hover:text-primary">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
            <LanguageSwitcher />

            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <DropdownMenuItem key={label} asChild>
                      <Link href={href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </div>
    </header>
  );
}
