import db from "../../../../firebase";
import { doc, setDoc } from "firebase/firestore";

const saveBasket = async (req, res) => {
  const { email, items } = req.body;

  try {
    const basketDocRef = doc(db, "users", email, "basket", "basket");

    // Set the basket data
    await setDoc(basketDocRef, { items });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error saving basket" });
  }
};

export default saveBasket;
