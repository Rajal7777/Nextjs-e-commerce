"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-09-20T00:00:00Z");

function calculateTimeLeft(targetDate: Date) {
  const currentTime = new Date();
  const timeDifference = Math.max(
    targetDate.getTime() - currentTime.getTime(),
    0,
  );

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeDifference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((timeDifference / (1000 * 60)) % 60),
    seconds: Math.floor((timeDifference / 1000) % 60),
  };
}

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeLeft> | null>(
    null,
  );

  useEffect(() => {
    const updateCountdown = () => {
      setTime(calculateTimeLeft(TARGET_DATE));
    };

    updateCountdown();
    const timeInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Loading skeleton state
  if (!time) {
    return (
      <section className="mx-auto my-16 w-full max-w-7xl px-4 sm:px-6">
        <div className="flex h-105 w-full items-center justify-center rounded-3xl border border-neutral-200/60 bg-neutral-50/50 dark:border-neutral-800/60 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Loading deal...
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isDealEnded =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  // Deal ended view
  if (isDealEnded) {
    return (
      <section className="mx-auto my-16 w-full max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-background p-8 shadow-xl dark:border-neutral-800 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:bg-neutral-800">
                Monthly Deal
              </span>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Deal Has Ended
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                This exclusive deal is no longer available. Stay tuned for our next upcoming promotions.
              </p>

              {/* Dummy Badge */}
              <div className="mt-6 inline-flex items-center justify-center rounded-full bg-neutral-200/80 px-8 py-3 text-sm font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                Deal Expired
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 shadow-xl dark:border-neutral-800 dark:bg-neutral-800 lg:aspect-square">
                <Image
                  src="/images/promo.jpg"
                  alt="Deal of the month promotion"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain grayscale"
                />
                <div className="absolute inset-0 bg-neutral-950/20" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Active deal view
  return (
    <section className="relative mx-auto my-16 w-full max-w-7xl px-4 sm:px-6">
      {/* Background Accent Glow */}
      <div className="absolute -left-12 -top-12 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-linear-to-b from-background via-background/95 to-neutral-50/50 p-6 shadow-2xl shadow-neutral-200/50 dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950 dark:shadow-none sm:p-10 lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column Content */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Limited Time Offer
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Deal of the{" "}
              <span className="bg-linear-to-r from-primary via-primary/80 to-amber-500 bg-clip-text text-transparent">
                Month
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Get ready for an extraordinary shopping experience. Enjoy
              exclusive savings and premium quality before the timer runs out.
            </p>

            {/* Countdown Grid */}
            <div className="mt-8 grid max-w-md grid-cols-4 gap-2 sm:gap-4">
              <StatBox value={time.days} label="Days" />
              <StatBox value={time.hours} label="Hours" />
              <StatBox value={time.minutes} label="Mins" />
              <StatBox value={time.seconds} label="Secs" />
            </div>

            {/* Dummy Badge */}
            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                <span>Deal Ends Soon</span>
                <span className="h-2 w-2 rounded-full bg-primary-foreground/80 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column Banner Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-background shadow-xl dark:border-neutral-800 dark:bg-neutral-800 lg:aspect-square">
              <Image
                src="/images/promo.jpg"
                alt="Deal of the month promotion"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealCountdown;

function StatBox({ value, label }: { value: number; label: string; }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-background/60 p-3 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/60 sm:p-4">
      <span className="text-2xl font-black tracking-tight text-foreground tabular-nums sm:text-3xl lg:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:text-xs">
        {label}
      </span>
    </div>
  );
}