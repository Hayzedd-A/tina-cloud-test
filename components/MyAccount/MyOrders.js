import { useRouter } from "next/router";
import * as moment from "moment";

import Table from "../Table";

import { OrdersConsumer } from "../../providers/OrdersProvider";
import { EmptyOrders } from "../../public/static/vectors";

const MyOrders = ({ orders, isLoadingOrders, showOrderDetails }) => {
  const router = useRouter();

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
        {!isLoadingOrders &&
          (!!activeOrders.length || !!pastOrders.length ? (
            <>
              {!!activeOrders.length && (
                <div className="orders-section">
                  <div className="section-title filled">Active Orders</div>
                  <Table
                    columns={columns}
                    rows={activeOrders}
                    // onClick={row => showOrderDetails(row)}
                  />
                </div>
              )}
              {!!pastOrders.length && (
                <div className="orders-section">
                  <div className="section-title">Past Orders</div>
                  <Table
                    columns={columns}
                    rows={pastOrders}
                    // onClick={row => showOrderDetails(row)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="cart-empty-state">
              <div className="icon">
                <EmptyOrders />
              </div>
              <div className="message">No order has been sent yet.</div>
              <div className="action" onClick={() => router.push("/")}>
                Shop now
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersConsumer(MyOrders);
