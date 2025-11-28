import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { saveBasket, selectItems } from "../slices/basketSlice";
import { useSession } from "next-auth/react";

const Product = ({ id, title, price, rating, description, category, image }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const items = useSelector(selectItems);
  const email = session?.user.email;

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

    const updatedBasketItems = items.map((basketItem) =>
      basketItem.id === product.id ? { ...basketItem, quantity: basketItem.quantity + 1 } : basketItem
    );

    if (updatedBasketItems.every((item) => item.id !== product.id)) {
      updatedBasketItems.push({ ...product, quantity: 1 });
    }

    dispatch(saveBasket({ email, items: updatedBasketItems }));
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">{category}</p>
      <div className="w-full h-[200px] relative mx-auto">
        <Image src={image} alt={title} className="object-contain" layout="fill" />
      </div>

      <h4 className="my-3">{title}</h4>

      <div className="flex">
        {Array(rating)
          .fill()
          .map((_, i) => (
            <StarIcon key={i} className="h-5 text-yellow-500" />
          ))}
      </div>

      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5">
        ${price}
        {/* <CurrencyFormat value={price} thousandSeparator={true} prefix={"$"} /> */}
      </div>

      <button onClick={addItemToBasket} className="mt-auto button">
        Add to Basket
      </button>
    </div>
  );
};

export default Product;
