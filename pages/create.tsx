import React, { FormEvent, useState } from "react";
import CommonBodyHeading from "../components/CommonBodyHeading";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  useNetwork,
  MediaRenderer,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import { NFT, NATIVE_TOKENS, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";

type Props = {};

function Create({}: Props) {
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const ownderNfts = useOwnedNFTs(collectionContract, address);
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(contract);

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    console.log("HERE")
    e.preventDefault();

    // Make sure user is on the right network, else prompt to switch
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 Week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS", data, variables, context);
            router.push("/");
          },
          onError(data, variables, context) {
            console.log("ERROR", data, variables, context);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 Week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS", data, variables, context);
            router.push("/");
          },
          onError(data, variables, context) {
            console.log("ERROR", data, variables, context);
          },
        }
      );
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl m-auto p-10">
        <CommonBodyHeading
          heading="List an Item"
          subheading="Select an item you would like to sell"
          description="Below you will find the NFTs you own in your wallet"
        />

        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownderNfts?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              className={`flex flex-col space-y-2 card min-w-fit max-w-xs ${
                nft.metadata.id === selectedNft?.metadata.id && "selectedCard"
              }`}
              onClick={() => setSelectedNft(nft)}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-md truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>

        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="font-bold text-white" htmlFor="">
                  Direct Listing / Fixed Price
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="directListing"
                />

                <label className="font-bold text-white" htmlFor="">
                  Auction Listing
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                />

                <label className="font-bold text-white" htmlFor="">
                  Price
                </label>
                <input
                  className="inputTransparent"
                  type="text"
                  placeholder="0.05 GOR"
                  name="price"
                />
              </div>

              <button
                className="button-main p-4 mt-8 w-full justify-center"
                type="submit"
              >
                {" "}
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}

export default Create;
