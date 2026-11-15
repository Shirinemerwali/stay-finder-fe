
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertiesFilter } from "@/utils/propertyService";

type PropertyFilterProps = {
  filter: PropertiesFilter;
};

export default function PropertyFilter({ filter }: PropertyFilterProps) {
  const router = useRouter();

  const [search, setSearch] = useState(filter.location || "");
  const [maxPrice, setMaxPrice] = useState(
    filter.maxPrice?.toString() || "",
  );
  const [maxGuests, setMaxGuests] = useState(
    filter.maxGuests?.toString() || "",
  );
  const [sort, setSort] = useState(filter.sort || "");

  const onFiltering = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("location", search.trim());
    }

    if (maxPrice && Number(maxPrice) > 0) {
      params.set("maxprice", maxPrice);
    }

    if (maxGuests && Number(maxGuests) > 0) {
      params.set("maxguests", maxGuests);
    }

    if (sort) {
      params.set("sort", sort);
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={search}
        placeholder="Location"
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
      />

      <input
        type="number"
        min="1"
        value={maxPrice}
        placeholder="Maximum price per night"
        onChange={(e) => setMaxPrice(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
      />

      <input
        type="number"
        min="1"
        value={maxGuests}
        placeholder="Number of guests"
        onChange={(e) => setMaxGuests(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as "" | "asc" | "desc")}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Default sorting</option>
        <option value="asc">Price: lowest first</option>
        <option value="desc">Price: highest first</option>
      </select>

      <button
        type="button"
        onClick={onFiltering}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Filter
      </button>
    </div>
  );
}
