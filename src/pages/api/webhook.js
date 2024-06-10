import { buffer } from "micro";
import * as admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_PERMISSIONS);

//Secure a connection to Firebase from the backend
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

//Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: Order ${session.id} had been added to the DB`);
    });
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    //Verify that the EVENT came from Stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (error) {
      res.status(400).send(`Webhook error: ${error.message}`);
    }

    //Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        await fulfillOrder(session);
        res.status(200).send();
      } catch (err) {
        console.log("Order fulfillment error", err);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
      res.status(400).send(`Webhook Error: Unhandled event type ${event.type}`);
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
