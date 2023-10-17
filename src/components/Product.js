import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";

const Product = ({ id, title, price, rating, description, category, image }) => {
  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">{category}</p>
      <Image src={image} height={200} width={200} alt={title} className="object-contain" />

      <h4 className="my-3">{title}</h4>

      <div className="flex">
        {Array(rating)
          .fill()
          .map((_, i) => (
            // <span key={i}>StarIcon</span>
            <StarIcon key={i} className="h-5 text-yellow-500" />
          ))}
      </div>

      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5">
        ${price}
        {/* <CurrencyFormat value={price} thousandSeparator={true} prefix={"$"} /> */}
      </div>

      <button className="mt-auto button">Add to Basket</button>
    </div>
  );
};

export default Product;
