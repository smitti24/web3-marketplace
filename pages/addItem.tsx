import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import { useAddress, useContract } from "@thirdweb-dev/react";
import placeholderImage from "../public/images/addItemPlaceholderImage.png";
import Image from "next/image";
import { useRouter } from "next/router";
import CommonBodyHeading from "../components/CommonBodyHeading";

type Props = {};

function addItem({}: Props) {
  const address = useAddress();
  const router = useRouter();
    const [preview, setPreview ] = useState<string>();
    const [image, setImage ] = useState<File>();
    const [isMinting, setIsMinting ] = useState<boolean>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) return;

    if (!image) {
        alert('Please select an image');
        return;
    }

    const target = e.target as typeof e.target & {
        name: { value: string}
        description: { value: string}
    }

    const metadata = {
        name: target.name.value,
        description: target.description.value,
        image: image
    }

    try {
        setIsMinting(true);
        await contract.mintTo(address, metadata).then((tx) => {
          const reciept = tx.receipt;
          const id = tx.id;
          const nft = tx.data;
  
          console.log(reciept, id, nft);
  
          router.push("/");
        }).finally(() => setIsMinting(false));

        

    } catch (error) {
        setIsMinting(false)
        console.error(error);
    }
  }

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 border ">
        <CommonBodyHeading heading="Add an Item to the Marketplace" subheading="Item Details" description="By adding an item to the marketplace, you're essentially Minting an
          NFT of the item into your wallet which we can then list for sale!"/>
        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5">
          <Image
            src={preview || placeholderImage}
            alt=""
            width={320}
            height={320}
          />

          <form onSubmit={mintNft} className="flex flex-col flex-1 p-2 space-y-2">
            <label className="font-bold text-white" htmlFor="">
              Name of Item
            </label>
            <input
              className="inputTransparent"
              type="text"
              placeholder="Name of item..."
              name="name"
              id="name"
            />

            <label className="font-bold text-white" htmlFor="">
              Description
            </label>
            <input
              className="inputTransparent"
              type="text"
              placeholder="Enter Description..."
              name="description"
              id="description"
            />

            <label className="font-bold text-white" htmlFor="">
              Image of the item
            </label>
            <input className="fileInput" type="file" name="" id="" onChange={(e) => {
                if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]))
                    setImage(e.target.files[0])
                }
            }}/>

            <div className="flex w-full items-center justify-center">
              <button type="submit" className="button-main py-4 px-10">
                {isMinting ? 'Minting NFT..' : 'Add/Mint Item' }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;
