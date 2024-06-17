import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket, removeFromBasket, saveBasket, selectItems } from "../slices/basketSlice";
import { useSession } from "next-auth/react";

const CheckoutProduct = ({ id, title, price, rating, description, category, image }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const status = useSelector((state) => state.basket.status);
  const email = session?.user.email;
  const basketItems = useSelector(selectItems);
  const item = basketItems.find((item) => item.id === id);
  const counter = item.quantity;

  const addItemToBasket = () => {
    const product = {
      id,
      title,
      price,
      rating,
      description,
      category,
      image,
    };

    //pushing items into the redux state
    dispatch(addToBasket(product));

    if (session) {
      const updatedBasketItems = basketItems.map((basketItem) =>
        basketItem.id === product.id ? { ...basketItem, quantity: basketItem.quantity + 1 } : basketItem
      );

      dispatch(saveBasket({ email, items: updatedBasketItems }));
    }
  };

  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }));

    if (session) {
      const updatedBasketItems = basketItems
        .map((basketItem) =>
          basketItem.id === id
            ? basketItem.quantity > 1
              ? { ...basketItem, quantity: basketItem.quantity - 1 }
              : null
            : basketItem
        )
        .filter((item) => item !== null);

      dispatch(saveBasket({ email, items: updatedBasketItems }));
    }
  };

  return (
    <div className="grid grid-cols-5">
      <Image src={image} height={200} width={200} objectFit="contain" />

      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>
        <div className="mb-5">${price}</div>
        <p className="text-xs text-gray-500">FREE Next-day Delivery</p>
      </div>

      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <div className="flex flex-row gap-2 items-center px-2 justify-evenly">
          <button
            className={`button px-5 ${counter === 1 && "cursor-default opacity-50"}`}
            onClick={removeItemFromBasket}
            disabled={counter <= 1 || status === "loading"}
          >
            -
          </button>
          {counter}
          <button className="button px-5" onClick={addItemToBasket}>
            +
          </button>
        </div>
        <button className="button" onClick={removeItemFromBasket}>
          Remove From Basket
        </button>
      </div>
    </div>
  );
};

export default CheckoutProduct;
