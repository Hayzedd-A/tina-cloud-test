import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Main from "../layouts/Main";

import Tabs from "../components/Tabs";
import Menu from "../components/Menu";
import { MyInfo, MyOrders } from "../components/MyAccount";

import OrdersProvider, { OrdersConsumer } from "../providers/OrdersProvider";

const MyAccount = () => {
  const router = useRouter();
  const [currentTab, switchTab] = useState(0);
  const tabs = ["My Info", "My Orders"];
  const tabContent = [<MyInfo />, <MyOrders />];

  useEffect(() => {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    !currentUser && router.push("/login");
  });

  return (
    <Main>
      <OrdersProvider>
        <div className="my-account">
          <div className="my-account-header">My Account</div>
          <Tabs tabs={tabs} currentTab={currentTab} switchTab={switchTab} />
          <div className="my-account-content">{tabContent[currentTab]}</div>
          <Menu />
        </div>
      </OrdersProvider>
    </Main>
  );
};

export default OrdersConsumer(MyAccount);
