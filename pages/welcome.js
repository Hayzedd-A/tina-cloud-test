import { useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { getRequest } from "../api";
import { STORE_ID, FIRST_ORDER_DISCOUNT_PERCENT } from "../constants";
import { Logo } from "../public/static/vectors";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import Toaster from "../components/Toaster";

export default function WelcomePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState("phone"); // phone | loading | coupon | ineligible
  const [couponCode, setCouponCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [toaster, setToaster] = useState(null);

  const handleCheck = async () => {
    if (!phoneNumber.trim()) return;
    setStep("loading");
    try {
      const checkRes = await getRequest({
        url: `/customer-requests/stores/check-first-time-user`,
        params: { phoneNumber },
      });

      if (!checkRes.data?.isFirstTimeUser) {
        setStep("ineligible");
        return;
      }

      const couponRes = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/coupon/new`,
        params: { couponType: "first_time_user", phoneNumber },
      });

      const code =
        couponRes.data?.code ||
        couponRes.data?.coupon?.code ||
        couponRes.data?.data?.code ||
        couponRes.data?.data?.couponCode;

      setCouponCode(code || "");
      localStorage.setItem("gourmet-twist-welcome-phone", phoneNumber);
      setStep("coupon");
    } catch {
      setToaster({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
      setStep("phone");
    }
  };

  const copyCode = useCallback(async () => {
    if (!couponCode) return;
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [couponCode]);

  return (
    <>
      <Head>
        <title>Your Exclusive Offer — Gourmet Twist</title>
      </Head>

      <div
        className={`welcome-page${step === "coupon" ? " welcome-page--revealed" : ""}`}
      >
        <div className="welcome-inner">
          <div className="welcome-logo-wrap">
            <Logo />
          </div>

          {/* ── Phone entry ── */}
          {step === "phone" && (
            <>
              <p className="welcome-eyebrow">Exclusive invite</p>
              <h1 className="welcome-headline">
                You&apos;ve been
                <br />
                invited.
              </h1>
              <p className="welcome-sub">
                A {FIRST_ORDER_DISCOUNT_PERCENT}% discount is waiting for you on
                your first order. Verify your phone number below to claim your
                code.
              </p>
              <div className="welcome-form">
                <input
                  className="welcome-input"
                  type="tel"
                  placeholder="08012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  autoComplete="tel"
                />
                <button
                  className="welcome-btn"
                  onClick={handleCheck}
                  disabled={!phoneNumber.trim()}
                >
                  Check my eligibility
                </button>
              </div>
            </>
          )}

          {/* ── Loading ── */}
          {step === "loading" && (
            <div className="welcome-loading">
              <div className="welcome-spinner" />
              <p className="welcome-loading-text">Checking your eligibility…</p>
            </div>
          )}

          {/* ── Coupon revealed ── */}
          {step === "coupon" && (
            <>
              <p className="welcome-eyebrow welcome-eyebrow--light">
                You qualify
              </p>
              <h1 className="welcome-headline welcome-headline--dark">
                Here&apos;s your
                <br />
                code.
              </h1>
              <p className="welcome-sub welcome-sub--dark">
                This code is unique to you and valid for one use. Enter it at
                checkout to redeem your {FIRST_ORDER_DISCOUNT_PERCENT}%
                discount.
              </p>

              <div
                className="welcome-ticket"
                onClick={copyCode}
                title="Tap to copy your code"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && copyCode()}
              >
                <div className="welcome-ticket-notch welcome-ticket-notch--left" />
                <div className="welcome-ticket-notch welcome-ticket-notch--right" />
                <p className="welcome-ticket-label">Your discount code</p>
                <div className="welcome-ticket-code">
                  <span>{couponCode}</span>
                  <span className="welcome-ticket-icon">
                    {copied ? (
                      <CheckOutlined style={{ color: "#52c41a" }} />
                    ) : (
                      <CopyOutlined />
                    )}
                  </span>
                </div>
                <p className="welcome-ticket-hint">
                  {copied ? "Copied to clipboard!" : "Tap anywhere to copy"}
                </p>
              </div>

              <Link href="/" legacyBehavior>
                <span className="welcome-btn welcome-btn--dark">
                  Start shopping →
                </span>
              </Link>
            </>
          )}

          {/* ── Not eligible ── */}
          {step === "ineligible" && (
            <>
              <h1
                className="welcome-headline"
                style={{ fontSize: 28, lineHeight: 1.3 }}
              >
                This number has already
                <br />
                placed an order.
              </h1>
              <p className="welcome-sub">
                This offer is exclusive to first-time customers. We&apos;re glad
                to have you back — shop again anytime.
              </p>
              <Link href="/" legacyBehavior>
                <a className="welcome-btn">Shop now →</a>
              </Link>
              <button
                className="welcome-btn-ghost"
                onClick={() => setStep("phone")}
              >
                Try a different number
              </button>
            </>
          )}
        </div>
      </div>

      {toaster && (
        <Toaster {...toaster} closeToaster={() => setToaster(null)} />
      )}
    </>
  );
}
