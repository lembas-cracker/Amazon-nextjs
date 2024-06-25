import Header from "../components/Header";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBasket,
  removeFromBasket,
  saveBasket,
  selectItems,
  selectTotal,
  selectTotalQuantity,
  setBasket,
} from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import { getSession, useSession } from "next-auth/react";
import getBasket from "../pages/api/basket/get";
import { useEffect } from "react";

const Checkout = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const totalQuantity = useSelector(selectTotalQuantity);
  const total = useSelector(selectTotal);
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    // Initialize the basket state from the localStorage if not logged in
    if (localStorage.getItem("items") && !session) {
      const basket = JSON.parse(localStorage.getItem("items"));
      dispatch(setBasket(basket));
    }
    // Sync the basket if just logged in
    const syncBasket = async () => {
      if (localStorage.getItem("items") && session) {
        const localItems = JSON.parse(localStorage.getItem("items"));
        const syncedItems = await getBasket(session.user.email);
        const combinedItems = [...syncedItems.items, ...localItems];

        localStorage.removeItem("items");
        dispatch(setBasket(combinedItems));
        dispatch(saveBasket({ email, items: combinedItems }));
      }
    };

    syncBasket();
  }, []);

  const handleAddItem = (item) => {
    //pushing items into the redux state
    dispatch(addToBasket(item));

    const updatedBasketItems = items.map((basketItem) =>
      basketItem.id === item.id ? { ...basketItem, quantity: basketItem.quantity + 1 } : basketItem
    );

    dispatch(saveBasket({ email, items: updatedBasketItems }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromBasket(id));

    if (session) {
      const updatedBasketItems = items
        .map((basketItem) => (basketItem.id === id ? null : basketItem))
        .filter((item) => item !== null);

      dispatch(saveBasket({ email, items: updatedBasketItems }));
    } else {
      const localBasket = JSON.parse(localStorage.getItem("items"));

      const updatedLocalBasket = localBasket
        .map((localItem) => (localItem.id === id ? null : localItem))
        .filter((item) => item !== null);

      if (updatedLocalBasket.length === 0) {
        localStorage.removeItem("items");
      } else {
        localStorage.setItem("items", JSON.stringify(updatedLocalBasket));
      }
    }
  };

  const handleDecrementItem = (id) => {
    if (session) {
      const updatedBasketItems = items
        .map((basketItem) =>
          basketItem.id === id
            ? basketItem.quantity > 1
              ? { ...basketItem, quantity: basketItem.quantity - 1 }
              : null
            : basketItem
        )
        .filter((item) => item !== null);

      dispatch(saveBasket({ email, items: updatedBasketItems }));
    } else {
      const localBasket = JSON.parse(localStorage.getItem("items"));

      const updatedLocalBasket = localBasket
        .map((localItem) =>
          localItem.id === id
            ? localItem.quantity > 1
              ? { ...localItem, quantity: localItem.quantity - 1 }
              : null
            : localItem
        )
        .filter((item) => item !== null);

      if (updatedLocalBasket.length === 0) {
        localStorage.removeItem("items");
      } else {
        localStorage.setItem("items", JSON.stringify(updatedLocalBasket));
      }
    }
  };

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
                handleRemoveItem={() => handleRemoveItem(item.id)}
                handleDecrementItem={() => handleDecrementItem(item.id)}
                handleAddItem={() => handleAddItem(item)}
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
  const email = session?.user?.email;

  if (!email) {
    return {
      props: {},
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
