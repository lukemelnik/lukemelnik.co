import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import ClearButton from "./ClearButton";

type ContentItem = {
  id: string;
  data: {
    title: string;
    description: string;
    source?: string;
    publishDate: Date;
    tags?: string[];
    [key: string]: any;
  };
};

type ContentSearchProps = {
  collection: ContentItem[];
  collectionType: string; // "recipes" or "blog"
};

// New ContentCard component
const ContentCard = ({
  item,
  collectionType,
}: {
  item: ContentItem;
  collectionType: string;
}) => (
  <article className="border-b-[1px]/80 pb-8">
    <h2 className="text-2xl font-bold">
      <a href={`/${collectionType}/${item.id}`} className="">
        {item.data.title}
        {item.data.source === "Family Recipe" && (
          <sup className="ml-1 text-xs">F</sup>
        )}
      </a>
    </h2>
    <div className="-mt-2 mb-3 flex flex-wrap items-center gap-x-3">
      <time
        dateTime={new Date(item.data.publishDate).toISOString()}
        className="text-foreground/60 text-sm font-extralight"
      >
        {new Date(item.data.publishDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      {item.data.tags && item.data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.data.tags.map((tag: string) => (
            <a
              key={tag}
              href={`/${collectionType}?search=${tag}`}
              className="text-foreground/60 text-sm font-extralight transition-colors hover:text-amber-600"
            >
              #{tag}
            </a>
          ))}
        </div>
      )}
    </div>
    <p className="text-foreground/80 text-base leading-relaxed">
      {item.data.description}
    </p>
    <a href={`/${collectionType}/${item.id}`} className="fancy-link font-bold">
      {collectionType === "recipes"
        ? "View recipe"
        : collectionType === "blog"
          ? "Read more"
          : "View   "}{" "}
      →
    </a>
  </article>
);

export default function ContentSearch({
  collection,
  collectionType,
}: ContentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);

  // Initialize Fuse.js
  const fuse = new Fuse(collection, {
    keys: ["data.title", "data.description", "data.tags"],
    includeScore: true,
    threshold: 0.1,
    ignoreLocation: true,
  });

  // Get the 5 most recent items
  const recentItems = [...collection]
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
    .slice(0, 5);

  // Handle search on mount to check for URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);
  }, []);

  // Perform search as user types and update URL
  useEffect(() => {
    if (searchQuery) {
      const results = fuse.search(searchQuery).map((result) => result.item);
      setSearchResults(results);

      // Update URL without full page reload
      const params = new URLSearchParams(window.location.search);
      params.set("search", searchQuery);
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    } else {
      setSearchResults([]);
      // Remove search param from URL if search is cleared
      window.history.pushState({}, "", window.location.pathname);
    }
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
      <div className="mb-6 sm:mb-10">
        <div className="flex-col items-center justify-between sm:flex sm:flex-row">
          <h1 className="sm:m-0">
            {collectionType === "blog" ? "Blog" : "Recipes"}
          </h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${collectionType}...`}
              className="bg-foreground text-background m-0 rounded-lg px-2 py-2 text-sm"
            />

            <ClearButton onClick={clearSearch} />
          </div>
        </div>
        {collectionType === "recipes" && (
          <p className="mt-4">
            Some recipes I love. Family ones are marked with <sup>F</sup>.{" "}
          </p>
        )}
      </div>

      {searchQuery ? (
        <div className="mb-6">
          <p className="text-sm">
            {searchResults.length === 0
              ? `No ${collectionType} found for "${searchQuery}"`
              : `Found ${searchResults.length} ${collectionType}${
                  searchResults.length === 1 ? "" : "s"
                } for "${searchQuery}"`}
          </p>
        </div>
      ) : (
        <h2 className="mb-4 text-lg font-extralight">Recent Additions:</h2>
      )}

      <div className="space-y-6">
        {searchQuery ? (
          searchResults.length > 0 ? (
            searchResults.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                collectionType={collectionType}
              />
            ))
          ) : (
            <div className="py-10 text-center">
              <p>No {collectionType} found.</p>
            </div>
          )
        ) : (
          recentItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              collectionType={collectionType}
            />
          ))
        )}
      </div>
    </div>
  );
}
