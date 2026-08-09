"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

//target date for sale end
const TARGET_DATE = new Date("2026-09-01T00:00:00Z");

//CALCULATE TIME LEFT
/*
1000 milliseconds = 1 second
60 seconds = 1 minute
60 minutes = 1 hour
24 hours = 1 day
*/
function calculateTimeLeft(targetDate: Date) {
  const currentTime = new Date();

  //convert to milliseconds Number(targetDate)
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((timeDifference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((timeDifference / (1000 * 60)) % 60),
    seconds: Math.floor((timeDifference / 1000) % 60),
  };
}

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeLeft>>(() =>
    calculateTimeLeft(TARGET_DATE),
  );

  useEffect(() => {
    const timeInterval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(TARGET_DATE);
      setTime(newTimeLeft);

      //clear when countdown reaches zero
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timeInterval);
      }
    }, 1000);

    //cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timeInterval);
  }, []);

  //render loading sate during initial render(prevent hydration error)
  if (!time) {
    return <p>Loading...</p>;
  }

  // If the countdown is over, display fallback UI
  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p>
            This deal is no longer available. Check out our latest promotions!
          </p>
          <div className="text-center">
            <Button asChild>
              <Link href="/search">View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/promo.jpg"
            alt="promotion"
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col  gap-2 justify-center uppercase">
        <div className="space-y-4">
          <h3 className="text-lg md:text-3xl font-bold">Deal of the month</h3>
          <p className="text-sm md:text-md font-medium text-muted-foreground bg-accent p-2 rounded-md shadow-sm">
            Get ready for a shopping experience like never before with our Deals
            of the Month! Every purchase comes with exclusive perks and offers,
            making this month a celebration of savvy choices and amazing deals.
            Don&apos;t miss out! 🎁🛒
          </p>
        </div>

        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days}  />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/promo.jpg"
          alt="promotion"
          width={300}
          height={200}
        />
      </div>
    </section>
  );
};

export default DealCountdown;

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <li className="p-2 w-full text-center bg-accent">
      <p className="text-xl font-bold">{value}</p>
      <p>{label}</p>
    </li>
  );
}
