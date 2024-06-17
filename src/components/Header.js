import Image from "next/image";
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectItems, selectTotalQuantity } from "../slices/basketSlice";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const items = useSelector(selectItems);
  const quantity = items.map((e) => e.quantity).reduce((acc, e) => acc + e, 0);
  const totalQuantity = useSelector(selectTotalQuantity);

  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
        <div className="h-[40px] w-[150px] relative mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            onClick={() => router.push("/")}
            src="https://i.imgur.com/CZrT9Ig.png"
            width={150}
            height={100}
            alt="Amazing!"
            className="cursor-pointer object-contain"
            layout="intrinsic"
          />
        </div>
        {/*Search*/}

        <div className="bg-yellow-400 hover:bg-yellow-500 hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer">
          <input type="text" className="p-2 h-full w-6 flex-grow rounded-l-md flex-shrink focus:outline-none px-4" />
          <MagnifyingGlassIcon className="h-12 p-4" />
        </div>

        {/*Right Section*/}
        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div onClick={!session ? signIn : signOut} className="link">
            <p className="hover:underline">{session ? `Hello, ${session.user.name}` : "Sign In"}</p>
            <p className="font-extrabold md:text-sm">Account & Lists</p>
          </div>

          <div onClick={() => session && router.push("/orders")} className="cursor-pointer link">
            <p>Returns</p>
            <p className="font-extrabold md:text-sm">& Orders</p>
          </div>

          <div onClick={() => router.push("/checkout")} className="link relative flex items-center">
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
              {!session && items.length > 0 ? items.length + quantity - 1 : totalQuantity}
            </span>
            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-2">Basket</p>
          </div>
        </div>
      </div>

      {/*Bottom Section*/}
      <div className="flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-white text-sm">
        <p className="link flex items-center">
          <Bars3Icon className="h-6 mr-1" />
          All
        </p>
        <p className="font-extrabold">
          Portfolio project with Next.js, Next-Auth, Redux Toolkit, Stripe test-mode payment and Firestore DB by Ksenia
          Agalakova. See code here:
        </p>
        <a href="https://github.com/lembas-cracker/Amazon-nextjs" className="font-extrabold underline">
          https://github.com/lembas-cracker/Amazon-nextjs
        </a>
      </div>
    </header>
  );
};

export default Header;
