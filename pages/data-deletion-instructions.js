import Head from "next/head";
import { Logo } from "../public/static/vectors";

export default function DataDeletionPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – Gourmettwist</title>
        <meta
          name="description"
          content="Read our Privacy Policy to learn how we handle your data."
        />
      </Head>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        <Logo width={50} height={50} />
        <br />
        <br />
        <h1>Data Deletion Instructions</h1>
        <br />
        <p>
          <strong>Effective Date:</strong> January 1, 2025
        </p>
        <br />
        <p>
          At Gourmet Twist, we respect your privacy and comply with applicable
          data protection laws, including Nigeria Data Protection Regulation
          (NDPR) and global platform policies.
        </p>
        <br />
        <p>
          If you have interacted with us via our website, WhatsApp, Instagram,
          or other digital channels and would like your personal data deleted
          from our records, please follow the steps below.
        </p>
        <br />
        <hr />
        <br />
        <h2>How to Request Data Deletion</h2>
        <br />
        <p>
          To request the deletion of your personal data (e.g., name, phone
          number, delivery address, communication logs, and order history),
          please:
        </p>
        <br />
        <ol style={{ paddingLeft: 30 }}>
          <li>Send an email to: 📧 hello@gourmettwist.ng</li>
          <li>Use the subject line: “Data Deletion Request”</li>
          <li>
            Include the following in your message:
            <br />
            <ol style={{ paddingLeft: 20 }}>
              <li>Full name</li>
              <li>Phone number or email address used for orders</li>
              <li>
                Any other identifier that can help us locate your records (e.g.,
                order number or WhatsApp chat ID)
              </li>
            </ol>
          </li>
        </ol>
        <br />
        <hr />
        <br />
        <h2>What Happens Next</h2>
        <br />
        <ul style={{ paddingLeft: 30 }}>
          <li style={{ listStyle: "unset" }}>
            We will verify your identity to ensure the request is legitimate.
          </li>
          <li style={{ listStyle: "unset" }}>
            Your data will be permanently deleted from our systems within 7
            business days of verification.
          </li>
          <li style={{ listStyle: "unset" }}>
            You will receive a confirmation email or WhatsApp message once the
            deletion is complete.
          </li>
        </ul>
        <br />
        <hr />
        <br />
        <h2>Important Notes</h2>
        <br />
        <ul style={{ paddingLeft: 30 }}>
          <li style={{ listStyle: "unset" }}>
            We may retain some transaction data for accounting, fraud
            prevention, or legal purposes where required by law.
          </li>
          <li style={{ listStyle: "unset" }}>
            Deletion of your data may result in loss of:
          </li>
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ listStyle: "circle" }}>
              Loyalty points or order history
            </li>
            <li style={{ listStyle: "circle" }}>
              Eligibility for re-delivery or refunds for prior orders
            </li>
          </ul>
        </ul>
        <br />
        <hr />
        <br />
        <p>
          If you have any additional questions about your privacy or rights,
          please reach out to:
        </p>
        <br />
        <p>
          📧 <a href="mailto:hello@gourmettwist.ng">hello@gourmettwist.ng</a>
          <br />
          📍 19B Fola Osibo Street, Lekki Phase 1, Lagos, Nigeria
        </p>
        <br />
        <hr />
        <br />
        <footer style={{ textAlign: "center" }}>
          <p>19B Fola Osibo, Lekki Phase 1, Lagos | Tel: 08185233149</p>
        </footer>
        <br />
      </div>
    </>
  );
}
