import React from "react";
import { useMetamask, useAddress, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import logo from "../public/images/marketplace.png";

type Props = {};

function Header({}: Props) {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl mx-auto p-2">
      <nav className="flex justify-between">
        <div className="flex items-center space-x-2 text-sm">
          {address ? (
            <button className="button-main" onClick={disconnect}>
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button className="button-main" onClick={connectWithMetaMask}>
              Connect your wallet
            </button>
          )}

          <p className="header-nav-item">Daily Deals</p>
          <p className="header-nav-item">Help & Contact</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <p className="header-nav-item">Ship To</p>
          <p className="header-nav-item">Sell</p>
          <Link className="flex items-center hover:link" href="/addItem">
            Watchlist
            <ChevronDownIcon className="px-2 h-4"></ChevronDownIcon>
          </Link>

          <Link className="flex items-center hover:link" href="/addItem">
            Add to inventory
            <ChevronDownIcon className="px-2 h-4"></ChevronDownIcon>
          </Link>

          <BellIcon className="h-4 w-6"></BellIcon>
          <ShoppingCartIcon className="h-4 w-6"></ShoppingCartIcon>
        </div>
      </nav>

      <hr className="mt-2"></hr>

      <section className="flex space-x-2 py-5 items-center">
        <div className="h-16 w-16 sm:w-28 cursor-pointer">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              alt="Thirdweb Logo"
              src={logo}
              width={100}
              height={100}
            />
          </Link>
        </div>

        <button className="hidden lg:flex items-center space-x-2 w-20 hover:link">
          <p className="text-sm">Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>

        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-white border-2 flex-1">
          <MagnifyingGlassIcon className="w-5 text-gray-400" />
          <input
            className="bg-transparent flex-1 outline-none"
            type="text"
            placeholder="search for anything"
          ></input>
        </div>

        <button className="button-main hidden sm:inline px-5 py-2 hover:scale-110 duration-300">
          Search
        </button>

        <Link href="/create">
          <button className="button-main sm:inline px-5 py-2 hover:scale-110 duration-300">
            List Item
          </button>
        </Link>
      </section>

      <hr className="mt-2"></hr>

      <section className="flex justify-center space-x-6 items-center px-6 py-5 whitespace-nowrap">
        <Link className="link" href="/">Home</Link>
        <p className="cursor-not-allowed" title="Coming soon!">Electronics</p>
        <p className="cursor-not-allowed" title="Coming soon!">Computers</p>
        <p className="cursor-not-allowed" title="Coming soon!">Video Games</p>
        <p className="hidden sm:inline cursor-not-allowed" title="Coming soon!">Home & Garden</p>
        <p className="hidden sm:inline cursor-not-allowed" title="Coming soon!">Home & Beauty</p>
        <p className="hidden md:inline cursor-not-allowed" title="Coming soon!">Colectibles and Art</p>
        <p className="hidden lg:inline cursor-not-allowed" title="Coming soon!">Books</p>
        <p className="hidden lg:inline cursor-not-allowed" title="Coming soon!">Music</p>
        <p className="hidden lg:inline cursor-not-allowed" title="Coming soon!">Deals</p>
        <p className="hidden xl:inline cursor-not-allowed" title="Coming soon!">Other</p>
        <p className="">More</p>
      </section>
    </div>
  );
}

export default Header;
