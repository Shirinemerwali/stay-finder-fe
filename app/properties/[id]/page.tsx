
import PropertyBookerCard from "@/components/PropertyBookerCard";
import T from "@/components/typography";
import { getPropertyById } from "@/utils/propertyService";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

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

export default async function PropertyPage({
  params,
}: PageProps<"/properties/[id]">) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <Link
        href="/"
        className="text-sm text-stone-500 transition hover:text-emerald-800"
      >
        ← All stays
      </Link>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium capitalize text-emerald-800">
          {property.kind}
        </p>

        <T.Header size="lg">{property.title}</T.Header>

        <p className="text-stone-500">{property.location}</p>
      </div>

      <div className="relative h-[300px] overflow-hidden rounded-3xl bg-stone-100 sm:h-[480px]">
        <Image
          src={getPropertyImage(property.title, property.location)}
          alt={property.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 900px"
        />
      </div>

      <p className="max-w-prose leading-relaxed text-stone-700">
        {property.description}
      </p>

      <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-sm shadow-sm">
        <div>
          <dt className="text-stone-500">Price per night</dt>
          <dd className="mt-1 text-xl font-semibold text-stone-900">
            {property.price_per_night} kr
          </dd>
        </div>

        <div>
          <dt className="text-stone-500">Guests</dt>
          <dd className="mt-1 text-xl font-semibold text-stone-900">
            {property.max_guests}
          </dd>
        </div>
      </dl>

      <PropertyBookerCard property={property} />
    </main>
  );
}
