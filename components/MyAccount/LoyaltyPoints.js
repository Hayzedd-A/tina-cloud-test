import { useRouter } from "next/router";
import * as moment from "moment";

import Table from "../Table";

import { OrdersConsumer } from "../../providers/LoyaltyPointsProvider";
import { EmptyOrders } from "../../public/static/vectors";
import Loader from "../Loader";
import { useState } from "react";

const LoyaltyPoints = ({ loyaltyPoints, isLoadingLoyaltyPoints, showOrderDetails }) => {
  const router = useRouter();

  const columnsEarned = [
    {
      label: "Date",
      render: ({ createdAt }) => moment(createdAt).format("DD/MM/YY hh:mm a")
    },
    {
      label: "Order Amount",
      render: ({ orderAmountWithoutDeliveryCharges }) => <span>₦ {orderAmountWithoutDeliveryCharges.toLocaleString()}</span>,
      className: "text-center"
    },
    {
      label: "Points Earned",
      render: ({ pointsToAwardIncludingStandardPoints }) => (
        <span className="price">{pointsToAwardIncludingStandardPoints?.toLocaleString()}</span>
      ),
      className: "my-order-price text-right"
    }
  ];

  const columnsReward = [
    {
      label: "Date",
      render: ({ createdAt }) => moment(createdAt).format("DD/MM/YY hh:mm a")
    },
    {
      label: "Redeemed Points",
      render: ({ pointsToAwardIncludingStandardPoints }) => <span>{(Math.abs(pointsToAwardIncludingStandardPoints)).toLocaleString()}</span>,
      className: "text-center"
    },
    {
      label: "Discount Earned",
      render: ({ discountPerPoint, pointsToAwardIncludingStandardPoints }) => (
        <span className="price">₦ {(discountPerPoint * (Math.abs(pointsToAwardIncludingStandardPoints)))?.toLocaleString()}</span>
      ),
      className: "my-order-price text-right"
    }
  ];

  const earned = loyaltyPoints
    .filter(({ direction }) => direction.toLowerCase() === "award")
  const redeemed = loyaltyPoints
    .filter(({ direction }) => direction.toLowerCase() === "redeem")
  const remainingPoints =
    earned.reduce((acc, nxt) => acc + nxt.pointsToAwardIncludingStandardPoints, 0) +
    redeemed.reduce((acc, nxt) => acc + nxt.pointsToAwardIncludingStandardPoints, 0);

  const remainingDiscount = remainingPoints * (loyaltyPoints?.length ? loyaltyPoints[0].discountPerPointRealtime : 0)

  const columnsRemaining = [
    {
      label: "",
      render: () => <span></span>,
    },
    {
      label: "Points",
      render: () => <span>{remainingPoints?.toLocaleString()}</span>,
      className: "text-center"
    },
    {
      label: "Discount",
      render: () => (
        <span className="price">₦ {remainingDiscount?.toLocaleString()}</span>
      ),
      className: "my-order-price text-right"
    }
  ];

  return (
    <div className="my-loyaltyPoints">
      <div className="container">
        {isLoadingLoyaltyPoints ? (
          <Loader />
        ) : loyaltyPoints.length ? (
          <>
            {!!earned.length && (
              <div className="orders-section">
                <div className="section-title filled">Earned</div>
                <Table
                  columns={columnsEarned}
                  rows={earned}
                />
              </div>
            )}
            {!!redeemed.length && (
              <div className="orders-section">
                <div className="section-title">Redeemed</div>
                <Table
                  columns={columnsReward}
                  rows={redeemed}
                />
              </div>
            )}

            <div className="orders-section">
              <div className="section-title">Remaining</div>
              <Table
                columns={columnsRemaining}
                rows={redeemed}
              />
            </div>
          </>
        ) : (
          <div className="cart-empty-state">
            <div className="icon">
              <EmptyOrders />
            </div>
            <div className="message">You do not have loyalty points history yet.</div>
            <div className="action" onClick={() => router.push("/")}>
              Shop now
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersConsumer(LoyaltyPoints);
