import Image from "next/image";
import Product from "./Product";

const ProductFeed = ({ products }) => {
  return (
    <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
      {products.slice(0, 4).map(({ id, title, price, rating, description, category, image }) => (
        <Product
          key={id}
          id={id}
          title={title}
          rating={rating}
          price={price}
          description={description}
          category={category}
          image={image}
        />
      ))}

      <Image
        className="md:col-span-full max-w-screen-2xl mx-auto"
        src="https://links.papareact.com/dyz"
        alt=""
        width={1500}
        height={300}
        loading="lazy"
      />

      <div className="md:col-span-2">
        {products.slice(4, 5).map(({ id, title, price, rating, description, category, image }) => (
          <Product
            key={id}
            id={id}
            title={title}
            rating={rating}
            price={price}
            description={description}
            category={category}
            image={image}
          />
        ))}
      </div>

      {products.slice(5, products.length).map(({ id, title, price, rating, description, category, image }) => (
        <Product
          key={id}
          id={id}
          title={title}
          rating={rating}
          price={price}
          description={description}
          category={category}
          image={image}
        />
      ))}
    </div>
  );
};

export default ProductFeed;
