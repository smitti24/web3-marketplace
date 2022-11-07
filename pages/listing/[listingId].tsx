import {
  MediaRenderer,
  useAddress,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useMakeOffer,
  useBuyNow,
  useOffers,
  useAcceptDirectListingOffer
} from "@thirdweb-dev/react";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CommonBodyHeading from "../../components/CommonBodyHeading";
import Header from "../../components/Header";
import Countdown from 'react-countdown';
import network from "../../utils/network";
import { ethers } from "ethers";
import { UserCircleIcon } from "@heroicons/react/24/outline";

function ListingPage() {
  const router = useRouter();
  const { listingId } = router.query as { listingId: string };
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string,
    symbol: string
  }>();
  const [bidAmount, setBidAmount] = useState('');
  const [offerAmount, setOfferAmount ] = useState('');
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const address = useAddress();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const {data: offers} = useOffers(contract, listingId);

  const {
    mutate: buyNow,
    isLoading: loadingBuyNow,
    error: errorBuyNow,
  } = useBuyNow(contract);

  const {
    mutate: makeOffer,
  } = useMakeOffer(contract);

  const {
    mutate: makeBid
  } = useMakeBid(contract);

  const {
    mutate: acceptOffer,
  } = useAcceptDirectListingOffer(contract);

  const { data: listing, isLoading, error } = useListing(contract, listingId);
  const lisingName = `${listing?.asset.name}`;
  const listingDescription = `${listing?.asset.description}`;
  const description = `Seller: ${listing?.sellerAddress}`;

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
        fetchMinNextBid();
    }
  }, [listingId, listing, contract]);

  const fetchMinNextBid = async () => {
    if (!listingId || !contract ) return;

    const { displayValue, symbol} = await contract.auction.getMinimumNextBid(listingId);

    setMinimumNextBid({
        displayValue,
        symbol
    });
  }

  const formatPlaceholder = () => {
    if (!listing) return; 
    if (listing.type === ListingType.Direct) {
        return 'Enter offer amount'
    }

    if (listing.type === ListingType.Auction) {
        if (!minimumNextBid) return 'Enter Bid Amout';

        return Number(minimumNextBid.displayValue) === 0 ? "Enter bid amount" : `${minimumNextBid.displayValue} ${minimumNextBid.symbol} or more..`
    }
  }

  const buyNft = async () => {
    if (networkMismatch) { //TODO: put this in a util file. So we can use it all over.
        switchNetwork && switchNetwork(network);
        return;
    }

    if (!listingId || !contract || !listing) return;

    await buyNow({
        id: listingId,
        buyAmount: 1,
        type: listing?.type
    }, {
        onSuccess(data, variables, context) {
            alert('NFT Has been bought!!! Congrats on your new item!');
            console.log('SUCCESS', data);
            router.replace('/');
        },
        onError(error, variables, context) {
            alert('Error buying this nft.');
            console.error("ERROR", error, variables, context);
        }
    })
  }

  console.log(offers);

  const createBidOrOffer = async () => {
    try {
        if (networkMismatch) {
            switchNetwork && switchNetwork(network);
            return;
        }

        // Direct listing

        if (listing?.type === ListingType.Direct) {
            if (listing.buyoutPrice.toString() === ethers.utils.parseEther(offerAmount).toString()) {
                buyNft();
                return;
            }

            console.log('Buyout price not met, making an offer...');

            await makeOffer({
                listingId: listingId,
                quantity: 1,
                pricePerToken: 0.000002
            }, {
                onSuccess(data, variables, context) {
                    alert('CONGRATS, You made an Offer!!');
                    console.log('SUCCESS', data);
                    setOfferAmount('');
                },
                onError(error, variables, context) {
                    alert('Error: Offer could not be made.');
                    console.error("ERROR", error, variables, context);
                }})
        }

        // Auction listing

        if (listing?.type === ListingType.Auction) {
            console.log('Making Bid...');

            await makeBid({
                listingId,
                bid: bidAmount
            }, {
                onSuccess(data, variables, context) {
                    alert('CONGRATS, You made a Bid!!');
                    console.log('SUCCESS', data);
                    setBidAmount('');
                },
                onError(error, variables, context) {
                    alert('Error: Bid could not be placed.');
                    console.error("ERROR", error, variables, context);
                }})
        }

    } catch (error) {
        console.log(error);
    }
  }

  if (!listing) {
    return (
        <div>
          <Header />
          <p className="flex justify-center animate-pulse text-[#c643f4]">
            Loading item...
          </p>
        </div>
      );
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl m-auto p-10">
        <CommonBodyHeading
          heading={lisingName}
          subheading={listingDescription}
          description={description}
        />
        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 card">
          <MediaRenderer className="h-80 rounded-lg"  src={listing.asset.image} />
          <div className="flex flex-col flex-1 p-2 space-y-2">
            <div className="grid grid-cols-2 items-center py-2">
              <p className="font-bold">Listing Type</p>
              <p>
                {listing.type === ListingType.Direct
                  ? "Direct Listing"
                  : "Auction Listing"}
              </p>

              <p className="font-bold">Buy it Now Price:</p>
              <p className="text-2xl font-bold">
                {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                {listing.buyoutCurrencyValuePerToken.symbol}
              </p>
              <div className="col-start-2">
                <button onClick={buyNft} className="col-start-2 mt-2 text-center button-main hover:scale-110 duration-300">
                  Buy Now
                </button>
              </div>          
            </div>
            {/* <div className="grid grid-cols-3 items-center py-4">
            {listing.type === ListingType.Direct && offers && (
                <>
                    <p className="font-bold text-1xl pb-3">Offers:</p>
                    <p className="font-bold text-1xl pb-3 col-span-2 ">{offers?.length ? offers?.length : 'No offers found.'}</p>
                    {offers?.map(offer => (
                        <>
                            <p className="flex items-center ml-5 text-sm italic">
                                <UserCircleIcon className="h-3 mr-2" />
                                {offer.offeror.slice(0, 5) + "..." + offer.offerer.slice(-5)} 
                            </p>
                            <div>
                                <p key={offer.listingId + offer.offeror + offer.totalOfferAmount.toString()}
                                    className="text-sm italic">
                                    {ethers.utils.formatEther(offer.totalOfferAmount)}
                                    {NATIVE_TOKENS[network].symbol}
                                </p>

                                {listing.sellerAddress === address && (
                                    <button className="button-main" onClick={() => {
                                        acceptOffer({
                                            listingId,
                                            addressOfOfferor: offer.offeror
                                        }, {
                                            onSuccess(data, variables, context) {
                                                alert('Offer accepted succesfully');
                                                console.log('SUCCESS', data);
                                                router.replace("/");
                                            },
                                            onError(error, variables, context) {
                                                alert('Error: Offer could not be accepted.');
                                                console.error("ERROR", error, variables, context);
                                            }});


                                    }}>Accept Offer</button>
                                )}
                            </div>
                        </>
                    ))}
                </>
            )}
            </div> */}
            <div className="grid grid-cols-2 items-center py-4">
                {listing.type === ListingType.Direct ? (
                    <>
                        <p className="col-span-2 font-bold text-2xl pb-3">Make an offer (Coming Soon!)</p>
                        <input disabled className="inputTransparent w-44 cursor-not-allowed" type="text" placeholder={formatPlaceholder()} onChange={(e) => setOfferAmount(e.target.value)}></input>
                        <div className="col-start-2 text-right justify-center">
                            <button disabled={true} onClick={createBidOrOffer} className="bg-slate-600 cursor-not-allowed col-start-2 mt-2 text-center button-main hover:scale-110 duration-300 ">
                                Make offer now
                            </button>
                        </div> 
                        
                    </>
                ) : (
                    <>
                        <p className="col-span-2 font-bold pb-3">Bid on this auction:</p>

                        
                        <p>Current Minimum Bid:</p>
                        <p>{minimumNextBid?.displayValue} {minimumNextBid?.symbol}</p>

                        <p>Time Remaining:</p>
                        <Countdown 
                            date={Number(listing.endTimeInEpochSeconds.toString()) * 1000} 
                        /> 

                        <input className="inputTransparent w-20 md:w-52 mt-4" type="text" placeholder={formatPlaceholder()} onChange={e => setBidAmount(e.target.value)}></input>
                        <div className="col-start-2 text-right justify-center mt-2">
                            <button onClick={createBidOrOffer} className="col-start-2 mt-2 text-center button-main hover:scale-110 duration-300">
                                Place Bid
                            </button>
                        </div> 
                    </>

                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingPage;
