
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | All2ools',
  description: 'Read the privacy policy for All2ools to understand how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl prose prose-lg dark:prose-invert">
        <h1 className="text-primary font-headline">Privacy Policy</h1>
        <p><em>Last Updated: July 26, 2024</em></p>

        <p>
          Welcome to All2ools ("we," "us," or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul>
            <li><strong>Usage Data:</strong> We may automatically collect information your browser sends whenever you visit our Site. This may include your computer's IP address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, and other statistics.</li>
            <li><strong>Client-Side Tool Data:</strong> For many of our tools, all processing happens entirely within your browser ("client-side"). We do not collect, see, or store the data you input into these tools (e.g., text for translation, JWT tokens for decoding, files for compression). Your data remains private to you.</li>
        </ul>

        <h2>2. Use of Your Information</h2>
        <p>
          Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Maintain and operate the Site.</li>
            <li>Fulfill and manage other business activities as needed.</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>
          We may use third-party services, such as Google AdSense, to serve advertisements when you visit the Site. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
        </p>

        <h2>4. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2>5. Policy for Children</h2>
        <p>
          We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@all2ools.com" className="text-primary">privacy@all2ools.com</a>.
        </p>
      </div>
    </div>
  );
}
