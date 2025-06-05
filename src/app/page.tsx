import { z } from "zod";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const HomePageSearchParams = z.object({
  page: z.string().catch("1"),
  search: z.string().optional(),
  sort: z.enum(["asc", "desc"]).catch("asc"),
  category: z.enum(["electronics", "books", "clothing"]).optional(),
});

export default async function Home(pageProps: PageProps) {
  const searchParams = HomePageSearchParams.parse(await pageProps.searchParams);

  console.log("searchParams", searchParams);

  const { page, search, sort } = searchParams;

  return (
    <main className="h-dvh flex justify-center items-center flex-col gap-2">
      <span>page: {page}</span>
      <span>search: {search}</span>
      <span>sort: {sort}</span>
    </main>
  );
}
