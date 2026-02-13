import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { X } from "lucide-react";

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
  onTagClick,
}: {
  item: ContentItem;
  collectionType: string;
  onTagClick: (tag: string) => void;
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
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className="text-foreground/60 cursor-pointer text-sm font-extralight transition-colors hover:text-accent"
            >
              #{tag}
            </button>
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
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);

  // All items sorted by date
  const allItems = useMemo(
    () =>
      [...collection].sort(
        (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
      ),
    [collection],
  );

  // Filter by all active tags (must match every tag)
  const tagFilteredItems = useMemo(() => {
    if (activeTags.length === 0) return allItems;
    return allItems.filter((item) =>
      activeTags.every((tag) => item.data.tags?.includes(tag)),
    );
  }, [activeTags, allItems]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function removeTag(tag: string) {
    setActiveTags((prev) => prev.filter((t) => t !== tag));
  }

  // Handle URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("search") || "");
    const tags = params.getAll("tag");
    if (tags.length > 0) setActiveTags(tags);
  }, []);

  // Perform search and update URL
  useEffect(() => {
    const params = new URLSearchParams();
    for (const tag of activeTags) params.append("tag", tag);
    if (searchQuery) params.set("search", searchQuery);
    const qs = params.toString();
    window.history.pushState(
      {},
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );

    if (searchQuery) {
      const fuse = new Fuse(tagFilteredItems, {
        keys: ["data.title", "data.description", "data.tags"],
        includeScore: true,
        threshold: 0.1,
        ignoreLocation: true,
      });
      setSearchResults(fuse.search(searchQuery).map((r) => r.item));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, tagFilteredItems]);

  const displayedItems = searchQuery ? searchResults : tagFilteredItems;
  const isFiltering = searchQuery || activeTags.length > 0;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <div className="flex-col items-center justify-between sm:flex sm:flex-row">
          <h1 className="flex items-center sm:m-0">
            {collectionType === "blog" ? "Blog" : "Recipes"}
            <span className="ml-6 text-base font-thin">
              ({collection.length} total)
            </span>
          </h1>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${collectionType}...`}
              className="border-foreground/30 focus:border-foreground/60 m-0 rounded-lg border bg-transparent px-3 py-2 text-base outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-foreground/50 hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        {collectionType === "recipes" && (
          <p className="mt-4">
            Some recipes I love. Family ones are marked with <sup>F</sup>.
          </p>
        )}
      </div>

      {activeTags.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeTags.map((tag) => (
            <button
              key={tag}
              onClick={() => removeTag(tag)}
              className="text-foreground bg-foreground/10 hover:bg-foreground/20 flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors"
            >
              #{tag}
              <X size={14} />
            </button>
          ))}
        </div>
      )}

      {isFiltering && (
        <div className="mb-6">
          <p className="text-sm">
            {displayedItems.length === 0
              ? "No results found"
              : `Found ${displayedItems.length} result${displayedItems.length === 1 ? "" : "s"}`}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {displayedItems.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            collectionType={collectionType}
            onTagClick={toggleTag}
          />
        ))}
      </div>
    </div>
  );
}
