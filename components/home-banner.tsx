import Image from "next/image";
import Link from "next/link";

import homeBanner from "@/public/images/banner/home-banner.jpg";

const HomeBanner = () => {
  return (
    <section
      aria-label="Promotional offers"
      className="mx-auto mt-4 w-full max-w-7xl px-2 sm:px-4"
    >
      <div className="group relative overflow-hidden rounded-2xl">
        <Link
          href="/search"
          className="group block w-full overflow-hidden rounded-xl"
        >
          {/* Banner Image */}
          <Image
            src={homeBanner}
            alt="Black Friday sales — up to 80% off selected items"
            sizes="100vw"
            placeholder="blur"
            priority
            className="
    h-auto
    w-full
    object-contain
    transition-transform
    duration-700
    group-hover:scale-[1.02]
  "
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="flex max-h-full w-full max-w-xl flex-col justify-center overflow-hidden px-4 py-3 text-white sm:px-10 sm:py-6 md:px-14">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 sm:mb-2 sm:text-sm">
                Limited Time Offer
              </p>

              <h1 className="text-xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Black Friday
                <span className="block text-white/90">
                  Up to{" "}
                  <span className="underline decoration-2 sm:decoration-4">
                    80% OFF
                  </span>
                </span>
              </h1>

              <p className="mt-2 hidden max-w-md text-xs text-white/80 sm:mt-3 sm:block sm:text-base">
                Discover amazing deals on selected products before the offer
                ends.
              </p>

              {/* CTA */}
              <div className="mt-3 inline-flex w-fit items-center rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition-all duration-300 group-hover:px-6 sm:mt-5 sm:px-5 sm:py-2.5 sm:text-sm">
                Shop Now
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HomeBanner;
