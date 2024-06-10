const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { items, email } = JSON.parse(req.body.data);

      const transformedItems = items.map((item) => ({
        price_data: {
          currency: "USD",
          unit_amount: item.price * 100,
          product_data: {
            name: item.title,
            description: item.description,
            images: [item.image],
          },
        },
        quantity: 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_address_collection: {
          allowed_countries: ["GB", "US", "CA", "FR", "IT"],
        },
        shipping_options: [
          {
            shipping_rate: "shr_1O7MFiKCtyjCzwb9Mlun05fY",
          },
        ],
        line_items: transformedItems,
        mode: "payment",
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/checkout`,
        metadata: {
          email,
          images: JSON.stringify(items.map((item) => item.image)),
        },
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end(`Method Not Allowed: ${req.method}`);
  }
}
