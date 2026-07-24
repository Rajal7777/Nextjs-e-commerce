import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product-actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
    const categories = await getAllCategories();
    console.log("categories", categories);
    
    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <Button variant="outline">
                    <MenuIcon />
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle> Select a Category</DrawerTitle>
                    <div className="space-y-1">
                        {categories.map((item) => (
                            <Button
                                key={item.category}
                                variant="ghost"
                                 className="w-full justify-start"
                                 asChild
                            >
                                <DrawerClose asChild>
                                    <Link href={`/search?category=${item.category}`}>
                                        {item.category} ({item._count})
                                    </Link>
                                </DrawerClose>
                            </Button>
                        ))}
                    </div>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    );
};

export default CategoryDrawer;
