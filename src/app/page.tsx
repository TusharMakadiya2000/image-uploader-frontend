import Link from "next/link";

export default function Home() {
  return (
    <main className="relative bg-white">
      <div className="bg-gradient-primary px-6 lg:px-18">

        <div className="container m-auto">
          <div className="w-full py-9 lg:py-18 flex flex-col justify-center items-center gap-12 lg:gap-32">
              <div className="">
                <div className="text-32 lg:text-6xl font-extrabold !leading-[120%]">
                  Walcome to image uploder.
                </div>
              </div>
                <Link
                  href={"/login"}
                  className="flex items-center justify-center bg-blue-400 w-full lg:w-auto px-4 py-3.5 lg:px-8 lg:py-4 rounded-2xl text-base font-semibold"
                >
                  Login
                </Link>
            </div>
        </div>
      </div>
    </main>
  );
}
