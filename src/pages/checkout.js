import Header from "../components/Header";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { data: session } = useSession();

  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        <div className="flex-grow m-5 shadow-sm">
          <Image src="https://links.papareact.com/ikj" width={1020} height={250} objectFit="contain" />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0 ? "Your Shopping Basket is empty" : "Shopping Basket"}
            </h1>

            {items.map((item, i) => (
              <CheckoutProduct
                key={i}
                id={item.id}
                title={item.title}
                price={item.price}
                rating={item.rating}
                description={item.description}
                category={item.category}
                image={item.image}
              />
            ))}
          </div>
        </div>

        {/*Right section */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):
                <span className="font-bold"> ${total}</span>
              </h2>

              <form action="/api/create-checkout-session" method="POST">
                <input type="hidden" name="data" value={JSON.stringify({ items, email: session?.user.email })} />
                <button
                  role="link"
                  disabled={!session}
                  className={`button mt-2 ${
                    !session && "from-gray-300 to-gray-500 border-gray-200 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  {!session ? "Sign in to checkout" : "Proceed to checkout"}
                </button>
                <p className="text-xs font-bold mt-2">
                  *Use this fake card number 4111 1111 1111 1111 in the payment form for a test checkout.*
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;
