import Header from "../components/Header";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal, selectTotalQuantity } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import { getSession, useSession } from "next-auth/react";
import getBasket from "../pages/api/basket/get";

const Checkout = () => {
  const items = useSelector(selectItems);
  const totalQuantity = useSelector(selectTotalQuantity);
  const total = useSelector(selectTotal);
  const { data: session } = useSession();

  return (
    <div className="bg-gray-100">
      <Header />

      <main className="lg:flex max-w-screen-2xl mx-auto">
        <div className="m-5 shadow-sm">
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center my-10">
                  <p className="mb-10 text-gray-500">Your Shopping Basket is empty</p>
                  <Image src="https://i.imgur.com/JLosnYt.png" alt="Empty Basket" width={300} height={300} />
                </div>
              ) : (
                "Shopping Basket"
              )}
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
          <Image src="https://links.papareact.com/ikj" width={1214} height={250} objectFit="contain" />
        </div>

        {/*Right section */}
        {items.length > 0 && (
          <>
            <div className="flex flex-col mt-5">
              <div className="bg-white p-10 shadow-md">
                <h2 className="whitespace-nowrap  overflow-x-auto">
                  Subtotal ({totalQuantity} items):
                  <span className="font-bold"> ${total.toFixed(2)}</span>
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
                    *Payment is in test-mode. You can use this fake card number 4111 1111 1111 1111 in the payment form
                    for a test checkout and fill in the rest of mock data in the form.*
                  </p>
                </form>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const email = session?.user.email;

  if (!session) {
    return {
      props: {
        session,
      },
    };
  }

  const initialState = {
    basket: await getBasket(email),
  };

  return {
    props: {
      initialState,
      session,
    },
  };
}

export default Checkout;
