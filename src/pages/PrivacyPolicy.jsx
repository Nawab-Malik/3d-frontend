import './LegalPages.css';

/**
 * Privacy Policy Page
 */
const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 2024</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including when you create an account,
            make a purchase, subscribe to our newsletter, or contact us for support.
          </p>
          <ul>
            <li>Name and contact information (email, phone number, shipping address)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Order history and purchase details</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our products and services</li>
            <li>Process referral rewards</li>
          </ul>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with:
          </p>
          <ul>
            <li>Payment processors (Stripe) to process transactions</li>
            <li>Shipping providers to deliver your orders</li>
            <li>Email service providers (SendGrid) for communication</li>
            <li>Analytics services to improve our website</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience,
            analyze website traffic, and remember your preferences.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Delete your account and associated data</li>
            <li>Unsubscribe from marketing emails</li>
            <li>Object to processing of your personal data</li>
            <li>Request a copy of your data</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@yourdomain.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
