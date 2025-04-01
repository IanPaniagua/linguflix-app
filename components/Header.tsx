'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, signInWithGoogle, logout } = useAuth()

  return (
    <header className="fixed w-full z-50 bg-background/30 backdrop-blur-[2px] border-b border-border/20">
      <div className="flex h-16 items-center justify-between px-8 md:px-12 lg:px-16">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">LinguFlix</span>
        </Link>

        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="default" 
              onClick={() => signInWithGoogle()}
              className="bg-primary hover:bg-primary/90"
            >
              Sign In with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  )
} 