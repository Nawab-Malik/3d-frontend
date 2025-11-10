import './LegalPages.css';

/**
 * Terms and Conditions Page
 */
const TermsAndConditions = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last Updated: November 2024</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms
            and provision of this agreement. If you do not agree to these terms, please do not
            use this website.
          </p>
        </section>

        <section>
          <h2>2. Products and Services</h2>
          <p>
            All products and services are subject to availability. We reserve the right to
            discontinue any product or service at any time without notice.
          </p>
          <ul>
            <li>Product descriptions and prices are subject to change without notice</li>
            <li>We reserve the right to limit quantities purchased per person or order</li>
            <li>All orders are subject to acceptance and availability</li>
          </ul>
        </section>

        <section>
          <h2>3. Pricing and Payment</h2>
          <p>
            All prices are listed in GBP (£) and include VAT where applicable. Payment is
            processed securely through Stripe.
          </p>
          <ul>
            <li>We accept major credit and debit cards</li>
            <li>Payment must be received before order processing</li>
            <li>Prices are subject to change without notice</li>
          </ul>
        </section>

        <section>
          <h2>4. Shipping and Delivery</h2>
          <p>Shipping costs and delivery times:</p>
          <ul>
            <li>Small items: £20 base price + shipping</li>
            <li>Medium items: £25 base price + shipping</li>
            <li>Large items: £30 base price + shipping</li>
            <li>Free shipping available on orders over the specified threshold</li>
            <li>Delivery times are estimates and not guaranteed</li>
          </ul>
        </section>

        <section>
          <h2>5. Returns and Refunds</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're not happy,
            we offer returns within 30 days of delivery.
          </p>
          <ul>
            <li>Items must be unused and in original packaging</li>
            <li>Custom or personalized items may not be returnable</li>
            <li>Refunds will be processed within 5-10 business days</li>
          </ul>
        </section>

        <section>
          <h2>6. Discount Codes and Promotions</h2>
          <p>Discount codes and promotional offers:</p>
          <ul>
            <li>Cannot be combined unless stated otherwise</li>
            <li>Are subject to expiration dates</li>
            <li>May have minimum purchase requirements</li>
            <li>Are non-transferable</li>
          </ul>
        </section>

        <section>
          <h2>7. Referral Program</h2>
          <p>Our referral program allows you to earn rewards:</p>
          <ul>
            <li>Referral rewards are issued when referred friends make their first purchase</li>
            <li>Self-referrals and fraudulent referrals are prohibited</li>
            <li>We reserve the right to modify or terminate the program at any time</li>
            <li>Rewards are non-transferable and have no cash value</li>
          </ul>
        </section>

        <section>
          <h2>8. User Accounts</h2>
          <p>When creating an account:</p>
          <ul>
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must notify us of any unauthorized use</li>
            <li>One account per person is allowed</li>
          </ul>
        </section>

        <section>
          <h2>9. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software,
            is the property of our company and protected by copyright and trademark laws.
          </p>
        </section>

        <section>
          <h2>10. Limitation of Liability</h2>
          <p>
            We shall not be liable for any indirect, incidental, special, or consequential
            damages arising out of or in connection with your use of our website or products.
          </p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the
            laws of the United Kingdom.
          </p>
        </section>

        <section>
          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective
            immediately upon posting to the website.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            For questions about these Terms & Conditions, please contact us at:
            <br />
            Email: support@yourdomain.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
