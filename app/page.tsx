import Image from "next/image";
import Link from "next/link";

import { Post, PostCategory } from "@/types/blog";
import { PostCard } from "@/components/Postcard";
import { CategoryBadge } from "@/components/Categorybadge";

/* ---------------------------
 Base URL helper
---------------------------- */
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

/* ---------------------------
 Fetch published posts
---------------------------- */
async function getPublishedPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/posts?status=published`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();

  } catch {
    return [];
  }
}

/* ---------------------------
 Page props
---------------------------- */
interface HomePageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

/* ---------------------------
 Server component
---------------------------- */
export default async function HomePage({
  searchParams,
}: HomePageProps) {

  // Fetch live posts from API
  const allPosts = await getPublishedPosts();

  const { category } = await searchParams;

  const activeCategory =
    category as PostCategory | undefined;

  // Optional category filter
  const filtered = activeCategory
    ? allPosts.filter(
        (p) => p.category === activeCategory
      )
    : allPosts;

  // First post = Hero
  const [heroPost, ...restPosts] = filtered;

  const gridPosts = restPosts.slice(0, 9);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

      {/* Hero */}
      {heroPost ? (
        <HeroPost post={heroPost} />
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">
            No posts found
            {activeCategory
              ? ` in "${activeCategory}"`
              : ""}
          </p>

          {activeCategory && (
            <Link
              href="/"
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              ← Clear filter
            </Link>
          )}
        </div>
      )}

      {/* Grid */}
      {gridPosts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            More Posts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <PostCard
                  post={post}
                  variant="public"
                  className="h-full"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

/* ---------------------------
 Hero component
---------------------------- */
function HeroPost({
  post,
}: {
  post: Post;
}) {

  function formatDate(iso?: string) {
    if (!iso) return "";

    return new Date(iso).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Latest Post
      </h2>

      <Link
        href={`/blog/${post.slug}`}
        className="group block"
      >
        <article
          className="
          relative rounded-2xl overflow-hidden
          border border-gray-200 shadow-md
          hover:shadow-xl transition-shadow
          bg-white flex flex-col md:flex-row"
        >

          <div
            className="
            relative md:w-1/2 h-64 md:h-auto
            bg-gradient-to-br
            from-blue-400 to-indigo-600"
          >
            {post.coverImageUrl ? (
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                width={1200}
                height={720}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-7xl font-black opacity-20">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-8 gap-4 flex-1">

            <CategoryBadge
              category={post.category}
              size="sm"
            />

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {post.title}
            </h1>

            <p className="text-gray-500 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>
                ⏱ {post.readingTimeMinutes} min
              </span>

              <span>
                👁 {post.viewCount} views
              </span>

              {post.publishedAt && (
                <span>
                  {formatDate(post.publishedAt)}
                </span>
              )}
            </div>

            <span className="text-blue-600 font-semibold text-sm">
              Read article →
            </span>

          </div>
        </article>
      </Link>
    </section>
  );
}