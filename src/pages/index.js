import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";
import { getSession } from "next-auth/react";
import getBasket from "../pages/api/basket/get";

export default function Home({ products }) {
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
  const session = await getSession(context);
  const email = session?.user.email;
  const products = await fetch("https://fakestoreapi.com/products").then((res) => res.json());

  const productsWithRatings = products.map((product) => ({ ...product, rating: getRandomRating() }));

  if (!session.user) {
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
