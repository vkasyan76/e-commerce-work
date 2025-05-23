import { caller } from "@/trpc/server";

interface Props {
  // Next.js asynchronously provides params
  params: Promise<{ category: string }>;
}

const Page = async ({ params }: Props) => {
  const { category } = await params;

  const products = await caller.products.getMany();

  return (
    <div>
      Category: {category}
      <br />
      Products: {JSON.stringify(products)}
    </div>
  );
};

export default Page;
