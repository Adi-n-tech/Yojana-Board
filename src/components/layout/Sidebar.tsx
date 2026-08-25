"use client";

import Link from 'next/link';
import { Home, CheckSquare, Folder, Users, Settings, GitBranch, LogOut, LogIn } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/20">
      <div className="p-6">
        <h2 className="text-lg font-bold">Yojana Board</h2>
      </div>
      
      <div className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Home className="h-4 w-4" />
            My Work
          </Link>
          <Link href="/tasks" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <CheckSquare className="h-4 w-4" />
            Inbox
          </Link>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </h3>
          <Link href="/projects" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Folder className="h-4 w-4" />
            Projects
          </Link>
          <Link href="/teams" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Users className="h-4 w-4" />
            Teams
          </Link>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Settings
          </h3>
          <Link href="/settings/github" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <GitBranch className="h-4 w-4" />
            GitHub
          </Link>
          <Link href="/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
      
      <div className="border-t p-4">
        {session ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback>{session.user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium line-clamp-1">{session.user?.name}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" className="w-full justify-start" onClick={() => signIn('google')}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In with Google
          </Button>
        )}
      </div>
    </div>
  );
}
