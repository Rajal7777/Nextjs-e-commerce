import Image from "next/image";
import Link from "next/link";
import homeBanner from "@/public/images/banner/home-banner.jpg";

const HomeBanner = () => {
    return (
        <section aria-label="Promotional offers" className="w-full max-w-6xl mx-auto mt-4">
            <Link
                href="/search"
                className="block transition-opacity duration-300 hover:opacity-95"
            >
                <Image
                    src={homeBanner}
                    alt="Black Friday sales — up to 80% off selected items"
                    sizes="100vw"
                    placeholder="blur"
                    className="h-auto w-full"
                />
            </Link>
        </section>
    );
};

export default HomeBanner;
