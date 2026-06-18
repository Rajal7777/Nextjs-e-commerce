'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const ModeToggle = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { theme, setTheme } = useTheme();

  console.log('theme', theme)
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
                <Button variant='ghost'>
                    {theme === 'system' ? (<SunMoon />) :
                        theme === 'dark' ? (<Moon />) : (<Sun />)
                    }
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