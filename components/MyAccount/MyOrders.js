import * as moment from "moment";

import Table from "../Table";

import { OrdersConsumer } from "../../providers/OrdersProvider";

const MyOrders = ({ orders }) => {
  const columns = [
    {
      label: "Date",
      render: ({ createdAt }) => moment(createdAt).format("DD/MM/YY")
    },
    {
      label: "Items",
      render: ({}) => <span>05</span>,
      className: "text-center"
    },
    {
      label: "Price",
      render: ({}) => <span className="price">₦ 6,000</span>,
      className: "text-right"
    }
  ];

  const activeOrders = orders.filter(({ status }) => status === "pending");
  const pastOrders = orders.filter(({ status }) => status !== "pending");

  return (
    <div className="my-orders">
      <div className="container">
        {!!activeOrders.length && (
          <div className="orders-section">
            <div className="section-title filled">Active Orders</div>
            <Table columns={columns} rows={activeOrders} />
          </div>
        )}
        {!!pastOrders.length && (
          <div className="orders-section">
            <div className="section-title">Past Orders</div>
            <Table columns={columns} rows={pastOrders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersConsumer(MyOrders);
