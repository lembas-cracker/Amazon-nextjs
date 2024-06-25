import db from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const getBasket = async (email) => {
  try {
    const basketDocRef = doc(db, "users", email, "basket", "basket");
    const basketDoc = await getDoc(basketDocRef);

    if (basketDoc.exists()) {
      return { items: basketDoc.data().items };
    } else {
      return { items: [] };
    }
  } catch (error) {
    console.error("Error fetching basket:", error);
    return { error: "Error fetching basket" };
  }
};

export default getBasket;
