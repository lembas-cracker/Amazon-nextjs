import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import { useSession } from "next-auth/react";

const CheckoutProduct = ({
  id,
  title,
  price,
  rating,
  description,
  category,
  image,
  handleRemoveItem,
  handleAddItem,
  handleDecrementItem,
}) => {
  const status = useSelector((state) => state.basket.status);
  const basketItems = useSelector(selectItems);
  const item = basketItems.find((item) => item.id === id);
  const counter = item.quantity;

  return (
    <div className="grid grid-cols-5">
      <Image src={image} height={200} width={200} objectFit="contain" />

      <div className="col-span-3 mx-5">
        <p className="text-xs text-gray-500">{category}</p>
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
            onClick={handleDecrementItem}
            disabled={counter <= 1 || status === "loading"}
          >
            -
          </button>
          {counter}
          <button className="button px-5" onClick={handleAddItem}>
            +
          </button>
        </div>
        <button className="button" onClick={handleRemoveItem}>
          Remove From Basket
        </button>
      </div>
    </div>
  );
};

export default CheckoutProduct;
