import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
// import { CustomCategory } from "../types";
import { useState } from "react";
import { ChevronRightIcon, ChevronsLeftIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // data: CustomCategory[]; // TODO: Remove this later.
}

export const CategoriesSidebar = ({ open, onOpenChange }: Props) => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.categories.getMany.queryOptions());

  const router = useRouter();

  // const [parentCategories, setParentCategories] = useState<
  //   CustomCategory[] | null
  // >(null);
  // const [selectedCategory, setSelectedCategory] =
  //   useState<CustomCategory | null>(null);

  // After TRCP introduction CategoryDropdown and SubcategoryMenu still expect a very specific shape. We define it in src\modules\categories\types.ts: CategoriesGetManyOutput

  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[1] | null
  >(null);

  // if we have parent Categories, show ThermometerSnowflake, otherwise show root categories:

  const currenrtCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      // this is a leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        // This is a subcategory - navigate to /category/subcategory.
        // Change the navigation to always use absolute paths by adding a leading slash in the router.push calls for subcategories.
        // Without a leading slash, router.push treats the URL as relative to the current path. With a leading slash, router.push('/new-path') treats it as an absolute path from the root.
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        //   This is a main category - navigate to /category
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }
      //   close Sidebar only wehn we redirecting:
      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base fornt-medium"
            >
              <ChevronsLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currenrtCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base fornt-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
