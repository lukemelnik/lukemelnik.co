import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { X } from "lucide-react";

type Item = {
  id: string;
  data: {
    title: string;
    description: string;
    familyRecipe?: boolean;
    publishDate: Date;
    tags?: string[];
    [key: string]: unknown;
  };
};

type Props = {
  collection: Item[];
  type: "blog" | "recipes";
  searchable?: boolean;
  searchPlaceholder?: string;
};

export default function ContentList({
  collection,
  type,
  searchable = false,
  searchPlaceholder,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const sorted = useMemo(
    () =>
      [...collection].sort(
        (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
      ),
    [collection],
  );

  const tagFiltered = useMemo(() => {
    if (activeTags.length === 0) return sorted;
    return sorted.filter((item) =>
      activeTags.every((t) => item.data.tags?.includes(t)),
    );
  }, [activeTags, sorted]);

  const fuse = useMemo(
    () =>
      new Fuse(tagFiltered, {
        keys: ["data.title", "data.description", "data.tags"],
        threshold: 0.25,
        ignoreLocation: true,
      }),
    [tagFiltered],
  );

  const displayed = searchQuery
    ? fuse.search(searchQuery).map((r) => r.item)
    : tagFiltered;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("search") ?? "");
    const tags = params.getAll("tag");
    if (tags.length > 0) setActiveTags(tags);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    for (const t of activeTags) params.append("tag", t);
    if (searchQuery) params.set("search", searchQuery);
    const qs = params.toString();
    window.history.replaceState(
      {},
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }, [searchQuery, activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function href(item: Item) {
    return type === "blog" ? `/${item.id}` : `/recipes/${item.id}`;
  }

  const emptyLabel = type === "blog" ? "No posts match." : "No recipes match.";

  return (
    <div>
      {searchable && (
        <div className="border-border mb-5 flex items-center border-b">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder ?? "Search…"}
            className="placeholder:text-muted-foreground w-full bg-transparent py-2 text-base outline-none"
          />
        </div>
      )}

      {activeTags.length > 0 && (
        <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span>Filtering:</span>
          {activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="bg-accent text-background hover:bg-accent/80 flex items-center gap-1 rounded-full px-2.5 py-0.5 transition-colors"
            >
              {tag}
              <X size={10} />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col">
        {displayed.map((item) => (
          <div
            key={item.id}
            className="border-border flex items-baseline justify-between gap-4 border-b py-3.5"
          >
            <div className="min-w-0 flex-1">
              <a
                href={href(item)}
                className="hover:text-accent text-[15px] font-medium transition-colors"
              >
                {item.data.title}
                {type === "recipes" && item.data.familyRecipe && (
                  <sup className="ml-1 text-[10px]">F</sup>
                )}
              </a>
              {item.data.description && (
                <p className="text-muted-foreground mt-1 text-sm leading-snug">
                  {item.data.description}
                </p>
              )}
            </div>
            {item.data.tags && item.data.tags.length > 0 && (
              <div className="flex max-w-[45%] shrink-0 flex-wrap justify-end gap-1">
                {item.data.tags.map((tag) => {
                  const active = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full border px-2 py-0 font-mono text-[11px] transition-colors ${
                        active
                          ? "bg-accent border-accent text-background"
                          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {displayed.length === 0 && (
          <p className="text-muted-foreground py-6 text-sm italic">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
  );
}
