import { useState, useEffect } from "react";
import Fuse from "fuse.js";

type ContentItem = {
  id: string;
  data: {
    title: string;
    description: string;
    publishDate: Date;
    tags?: string[];
    [key: string]: any;
  };
};

type ContentSearchProps = {
  collection: ContentItem[];
  collectionType: string; // "recipes" or "blog"
};

export default function ContentSearch({
  collection,
  collectionType,
}: ContentSearchProps) {
  // Get search query from URL
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize Fuse.js
  const fuse = new Fuse(collection, {
    keys: ["data.title", "data.description", "data.tags"],
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
  });

  // Get the 5 most recent items
  const recentItems = [...collection]
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())
    .slice(0, 5);

  // Handle search on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);

    if (query) {
      setIsSearching(true);
      const results = fuse.search(query).map((result) => result.item);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [window.location.search]);

  // Handle form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);

    if (searchQuery) {
      params.set("search", searchQuery);
      setIsSearching(true);
    } else {
      params.delete("search");
      setIsSearching(false);
    }

    // Update URL without full page reload
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    // Perform search
    if (searchQuery) {
      const results = fuse.search(searchQuery).map((result) => result.item);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
    window.history.pushState({}, "", window.location.pathname);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${collectionType}...`}
            className="bg-foreground text-background rounded-lg px-2 py-1"
          />
          <button
            type="submit"
            className="bg-foreground text-background rounded-lg p-1 px-2 cursor-pointer font-normal text-base"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="submit"
              className="border-2 border-foreground rounded-lg p-1 px-2 cursor-pointer font-normal text-base"
              onClick={clearSearch}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {isSearching && (
        <div className="mb-6">
          <p className="text-sm">
            {searchResults.length === 0
              ? `No ${collectionType} found for "${searchQuery}"`
              : `Found ${searchResults.length} ${collectionType}${
                  searchResults.length === 1 ? "" : "s"
                } for "${searchQuery}"`}
          </p>
        </div>
      )}

      {!isSearching && (
        <h2 className="text-2xl font-semibold mb-6">Recent Additions</h2>
      )}

      <div className="space-y-6">
        {isSearching ? (
          searchResults.length > 0 ? (
            searchResults.map((item) => (
              <article
                key={item.id}
                className="group border-b border-gray-200 pb-6"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  <a
                    href={`/${collectionType}/${item.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.data.title}
                  </a>
                </h2>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <time
                    dateTime={new Date(item.data.publishDate).toISOString()}
                  >
                    {new Date(item.data.publishDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </time>
                  {item.data.tags && (
                    <div className="flex gap-2">
                      {item.data.tags.map((tag: string) => (
                        <a
                          key={tag}
                          href={`/${collectionType}?search=${tag}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          #{tag}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  {item.data.description}
                </p>
                <a
                  href={`/${collectionType}/${item.id}`}
                  className="inline-block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View {collectionType === "recipes" ? "recipe" : "post"} →
                </a>
              </article>
            ))
          ) : (
            <div className="text-center py-10">
              <p>No {collectionType} found.</p>
            </div>
          )
        ) : (
          recentItems.map((item) => (
            <article
              key={item.id}
              className="group border-b border-gray-200 pb-6"
            >
              <h2 className="text-2xl font-semibold mb-2">
                <a
                  href={`/${collectionType}/${item.id}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.data.title}
                </a>
              </h2>
              <div className="flex items-center gap-4 text-sm mb-3">
                <time dateTime={new Date(item.data.publishDate).toISOString()}>
                  {new Date(item.data.publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {item.data.tags && (
                  <div className="flex gap-2">
                    {item.data.tags.map((tag: string) => (
                      <a
                        key={tag}
                        href={`/${collectionType}?search=${tag}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        #{tag}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                {item.data.description}
              </p>
              <a
                href={`/${collectionType}/${item.id}`}
                className="inline-block text-blue-600 hover:text-blue-800 transition-colors"
              >
                View {collectionType === "recipes" ? "recipe" : "post"} →
              </a>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
