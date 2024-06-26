import moment from "moment";

const Order = ({ id, amount, amountShipping, items, timestamp, images }) => {
  const quantity = items.map((e) => e.quantity).reduce((acc, e) => acc + e, 0);

  return (
    <div className="relative border rounded-md">
      <div className="flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600">
        <div>
          <p className="font-bold text-xs">ORDERS PLACED</p>
          <p>{moment.unix(timestamp).format("DD MMM YYYY")}</p>
        </div>

        <div>
          <p className="font-bold text-xs">TOTAL</p>
          <p>
            ${amount} - Next Day Delivery{""} ${amountShipping}
          </p>
        </div>

        <p className="text-sm whitespace-nowrap sm:text-xl self-end flex-1 text-right text-blue-500">
          {quantity} items
        </p>
        <p className="absolute top-2 right-2 w-40 lg:w-72 truncate text-xs whitespace-nowrap">ORDER № {id}</p>
      </div>
      <div className="p-5 sm:p-10">
        <div className="flex space-x-6 overflow-x-auto">
          {images.map((image, i) => (
            <img key={i} src={image} alt="" className="h-20 object-contain sm:h-28" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
