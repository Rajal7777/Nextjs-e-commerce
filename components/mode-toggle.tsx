'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const ModeToggle = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { theme, setTheme } = useTheme();


    useEffect(() => {
        setIsMounted(true);
    }, []);

    //server component does not have window object so to prevent hydration error we check if component is mounted if not return
    if (!isMounted) {
        return null;
    }

    return (
        <DropdownMenu>
         <DropdownMenuTrigger asChild>
  <Button
    variant="ghost"
    size="icon-lg"
    className="focus-visible:ring-0 focus-visible:ring-offset-0 text-muted-foreground"
  >
    {theme === "system" ? (
      <SunMoon className="size-5" />
    ) : theme === "dark" ? (
      <Moon className="size-5" />
    ) : (
      <Sun className="size-5" />
    )}
  </Button>
</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={theme} onValueChange={(val) => setTheme(val)}>
                    <DropdownMenuRadioItem value="system">system</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">light</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">dark</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ModeToggle;