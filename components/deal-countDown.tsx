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

type TimeLeft = ReturnType<typeof calculateTimeLeft>;

const DealCountdown = () => {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      setTime(calculateTimeLeft(TARGET_DATE));
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <DealLoading />;
  }

  const isDealEnded =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  if (isDealEnded) {
    return <DealEnded />;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-1 py-16 sm:px-4 lg:py-10 ">
      <div className="relative overflow-hidden rounded-3xl">
        {/* Subtle background glow */}

        <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
          {/* Content */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Limited Time Offer
            </div>

            {/* Heading */}
            <h2 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Deal of the <span className="text-primary">Month</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Discover exclusive deals and enjoy special savings on selected
              products. Don&apos;t miss out — this offer ends soon.
            </p>

            {/* Countdown */}
            <div className="mt-8 grid max-w-lg grid-cols-4 gap-2 sm:gap-3">
              <StatBox value={time.days} label="Days" />
              <StatBox value={time.hours} label="Hours" />
              <StatBox value={time.minutes} label="Minutes" />
              <StatBox value={time.seconds} label="Seconds" />
            </div>

            {/* Bottom status */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Deal ends soon
              </div>

              <span className="hidden text-sm text-muted-foreground sm:block">
                Limited availability
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="relative mx-0 sm:mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-lg md:max-w-90 p-4">
              <Image
                src="/images/promo.jpg"
                alt="Deal of the month promotion"
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Image badge */}
              <div className="absolute bottom-2 left-2 rounded-xl border border-white/20 bg-black/50 text-white  px-1 py-1 backdrop-blur-md ">
                <p className="text-[10px] font-medium uppercase  text-white/70">
                  Special Offer
                </p>

                <p className="text-sm font-semibold tracking-tighter ">
                  Shop before it&apos;s gone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealCountdown;

/* Countdown Box  */

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-border bg-background px-2 py-3.5 sm:px-4 sm:py-4">
      <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-1 text-[9px] font-medium uppercase tracking-widest text-muted-foreground sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

/* Loading   */

function DealLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex min-h-80 items-center justify-center rounded-3xl border border-border bg-card">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Loading deal...
        </div>
      </div>
    </section>
  );
}

/* Deal Ended */
function DealEnded() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:p-12">
          {/* Content */}
          <div className="lg:col-span-7">
            <span className="inline-flex rounded-full border border-border bg-muted px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Monthly Deal
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Deal Has Ended
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              This exclusive deal is no longer available. Stay tuned for our
              next upcoming promotion.
            </p>

            <div className="mt-7 inline-flex items-center rounded-full border border-border bg-muted px-5 py-2.5 text-sm font-medium text-muted-foreground">
              Deal Expired
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="relative mx-0 sm:mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-lg md:max-w-90 p-4">
              <Image
                src="/images/promo.jpg"
                alt="Deal of the month promotion"
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
