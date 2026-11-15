
import type { Property } from "@/types/property";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Image from "next/image";

type PropertyCardProps = {
  property: Property;
  className?: string;
};

function getPropertyImage(title: string, location: string) {
  const propertyTitle = title.toLowerCase();
  const place = location.toLowerCase();

  if (propertyTitle.includes("cozy apartment")) {
    return "/images/bastu.png";
  }

  if (place.includes("stockholm") || place.includes("sundbyberg")) {
    return "/images/12.png";
  }

  if (place.includes("malmö")) {
    return "/images/123.png";
  }

  return "/images/12.png";
}

export default function PropertyCard({
  property,
  className,
}: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.property_id}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative h-64 overflow-hidden bg-stone-100">
        <Image
          src={getPropertyImage(property.title, property.location)}
          alt={property.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-stone-900 transition group-hover:text-emerald-800">
              {property.title}
            </h3>

            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              {property.kind === "villa" ? "Villa" : "Apartment"}
            </span>
          </div>

          <p className="mt-1 text-sm text-stone-500">
            {property.location}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <p className="text-lg font-semibold text-stone-900">
            {property.price_per_night} kr
            <span className="text-sm font-normal text-stone-500">
              {" "}/ night
            </span>
          </p>

          <span className="text-sm font-medium text-emerald-800 transition group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
