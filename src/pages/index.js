import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";
import { getSession, useSession } from "next-auth/react";
import getBasket from "../pages/api/basket/get";
import { saveBasket, setBasket } from "../slices/basketSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import FAKE_PRODUCTS from "../_fake-products";

export default function Home({ products }) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    // Initialize the basket from the localStorage if not logged in
    if (localStorage.getItem("items") && !session) {
      const basket = JSON.parse(localStorage.getItem("items"));
      dispatch(setBasket(basket));
    }

    // Sync the local basket if just logged in with the basket in the database
    const syncBasket = async () => {
      if (localStorage.getItem("items") && session) {
        const localItems = JSON.parse(localStorage.getItem("items"));
        const syncedItems = await getBasket(session.user.email);
        const combinedItems = [...syncedItems.items, ...localItems];

        localStorage.removeItem("items");
        dispatch(saveBasket({ email, items: combinedItems }));
      }
    };

    syncBasket();
  }, []);

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazing - Amazon 2.0</title>
      </Head>
      <Header />
      <main className="max-w-screen-2xl mx-auto">
        <Banner />
        <ProductFeed products={products} />
      </main>
    </div>
  );
}

const MAX_RATING = 5;
const MIN_RATING = 1;

// Generate a random number between 1 and 5
const getRandomRating = () => {
  return Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING;
};

export async function getServerSideProps(context) {
  // Returns Cloudflare challenge HTML on Versel servers, but not on localhost.
  // Replacing with a static response.
  // const products = await (await fetch("https://fakestoreapi.com/products")).json();
  const products = FAKE_PRODUCTS;

  const productsWithRatings = products.map((product) => ({ ...product, rating: getRandomRating() }));

  const session = await getSession(context);
  const email = session?.user?.email;
  if (!email) {
    return {
      props: {
        products: productsWithRatings,
      },
    };
  }

  const initialState = {
    basket: await getBasket(email),
  };

  return {
    props: {
      products: productsWithRatings,
      initialState,
      session,
    },
  };
}
