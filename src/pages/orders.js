import { getSession, useSession } from "next-auth/react";
import Header from "../components/Header";
import moment from "moment";
import db from "../../firebase";
import Order from "../components/Order";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Orders({ orders }) {
  const { data: session, status } = useSession();
  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">Your Orders</h1>
        {session ? <h2>{orders.length} Orders</h2> : <h2>Please sign in to see your orders</h2>}

        <div className="mt-5 space-y-4">
          {orders?.map(({ id, amount, amountShipping, items, timestamp, images }) => (
            <Order
              key={id}
              id={id}
              amount={amount}
              amountShipping={amountShipping}
              items={items}
              timestamp={timestamp}
              images={images}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  //Get the users logged in credentials
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }

  //firebase DB
  const stripeOrders = async () => {
    const userEmail = session.user.email;
    const ordersColl = collection(db, "users", userEmail, "orders");
    const q = query(ordersColl, orderBy("timestamp", "desc"));

    try {
      const querySnapshot = await getDocs(q);
      // Access the documents from the query snapshot
      // NOTE: `doc.id` exists here but not inside `doc.data()`, we add it to the data object manually.
      //See https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
      const orders = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return orders;
      // Now 'orders' contains the data retrieved from the Firestore
    } catch (error) {
      console.error("Error getting orders: ", error);
    }
  };

  const orderArray = await stripeOrders();

  //stripe orders
  const orders = [];
  for (const order of orderArray) {
    const orderData = {
      id: order.id,
      amount: order.amount,
      amountShipping: order.amount_shipping,
      images: order.images,
      timestamp: moment(order.timestamp.toDate()).unix(),
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    };
    orders.push(orderData);
  }

  return {
    props: {
      orders,
      session,
    },
  };
}
