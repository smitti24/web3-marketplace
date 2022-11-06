import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  MediaRenderer,
  useActiveListings,
  useContract,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import Link from "next/link";
import Header from "../components/Header";

const Home: NextPage = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

    contract?.events.addTransactionListener((event) => {
      console.log(event);
    })

  return (
    <div>
      <Header />

      <main className="max-w-6xl py-2 px-6 mx-auto">
        {loadingListings ? (
          <p className="flex justify-center animate-pulse text-[#c643f4]">
            Loading listings...
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings?.map((listing) => (
              <Link className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out min-h-[44px]" href={`/listing/${listing.id}`} key={listing.id}>
                <div>
                  <div className="flex flex-1 flex-col pb-2 items-center">
                    <MediaRenderer className="w-44" src={listing.asset.image} />
                  </div>

                  <div className="pt-2 space-y-4">
                    <div>
                      <h2 className="text-xl truncate">
                        {listing?.asset.name}
                      </h2>
                      <hr />
                      <p className="truncate text-sm text-gray-400">
                        {listing.asset.description}
                      </p>
                    </div>

                    <p>
                      <span className="font-bold mr-1">
                        {listing?.buyoutCurrencyValuePerToken.displayValue}
                      </span>
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>

                    <div
                      className={`flex items-center space-x-1 justify-end text-xs w-fit ml-auto p-2 rounded-lg ${
                        listing.type === ListingType.Direct
                          ? "bg-[#c643f4]"
                          : "bg-[#3b0050]"
                      }`}
                    >
                      <p>
                        {listing.type === ListingType.Direct
                          ? "Buy Now"
                          : "Auction"}
                      </p>
                      {listing.type === ListingType.Direct ? (
                        <BanknotesIcon className="h-6" />
                      ) : (
                        <ClockIcon className="h-6" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
