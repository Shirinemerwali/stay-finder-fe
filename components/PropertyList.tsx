
import PropertyCard from "./PropertyCard";
import { getProperties, type PropertiesFilter } from "@/utils/propertyService";
import PropertyFilter from "./PropertyFilter";
import T from "./typography";

type PropertyListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertyList({
  searchParams,
}: PropertyListProps) {
  const params = await searchParams;

  const propertiesFilter: PropertiesFilter = {
    location: params.location?.toString() || "",
    maxPrice: params.maxprice ? Number(params.maxprice) : undefined,
    maxGuests: params.maxguests ? Number(params.maxguests) : undefined,
    sort:
      params.sort === "asc" || params.sort === "desc"
        ? params.sort
        : undefined,
  };

  const properties = await getProperties(propertiesFilter);

  return (
    <div className="flex flex-col gap-12">
      <section
        className="relative flex min-h-[420px] flex-col justify-center overflow-hidden rounded-3xl bg-cover bg-center px-8 py-16 text-white sm:px-12"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15, 25, 19, 0.75), rgba(15, 25, 19, 0.15)), url('/images/hemsida.jpeg')",
        }}
      >
        <div className="relative z-10 max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-white/80">
            Discover Sweden
          </p>

          <h1 className="mb-5 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Find your next escape.
          </h1>

          <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            Discover beautiful places to stay, from peaceful lakeside villas
            to magical northern escapes.
          </p>

          <a
            href="#stays"
            className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-200"
          >
            Explore stays
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-800">
            Find your place
          </p>
          <T.Header size="lg">Where would you like to stay?</T.Header>
        </div>

        <PropertyFilter filter={propertiesFilter} />
      </section>

      <section id="stays" className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-800">
            Explore our collection
          </p>

          <T.Header size="lg">Places to stay</T.Header>

          <p className="mt-2 text-sm text-stone-500">
            Find a place that feels like your own.
          </p>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard
                key={property.property_id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
            <p className="text-lg font-medium text-stone-800">
              No stays found
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Try changing your filters to find more places.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
