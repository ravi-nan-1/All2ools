
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | All2ools',
  description: 'Read the privacy policy for All2ools to understand how we handle your data when you use our free online tools.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl prose dark:prose-invert prose-headings:font-headline prose-headings:tracking-tight prose-h1:text-primary prose-h1:text-3xl prose-h2:text-2xl prose-a:text-primary hover:prose-a:text-primary/80">
        <header className="text-center mb-12 not-prose">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
            Privacy Policy for All2ools
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Last Updated: December 03, 2025
          </p>
        </header>

        <p>Welcome to All2ools (“we”, “our”, “us”). We operate at all2ools.com and provide a collection of free online tools including AI utilities, document converters, SEO tools, image tools, business calculators, and developer utilities.</p>
        <p>This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and tools.</p>
        <p>By using All2ools, you agree to this Privacy Policy.</p>

        <h2>1. Information We Collect</h2>
        <p>We collect the minimum amount of information necessary to operate our tools.</p>
        
        <h3>1.1 Information You Provide</h3>
        <p>Depending on the tool you use, you may submit:</p>
        <ul>
            <li>Text content (e.g., for AI tools, plagiarism checkers, regex generators)</li>
            <li>Uploaded files (PDF, images, Excel, JSON, etc.)</li>
            <li>URLs (for API or SEO tools)</li>
            <li>Inputs for calculators (finance, business, etc.)</li>
        </ul>
        <p className="font-bold text-destructive">❗ We do NOT store your uploaded files or text permanently. All processing is temporary and deleted automatically after the tool finishes processing.</p>

        <h3>1.2 Automatically Collected Information</h3>
        <p>We may collect:</p>
        <ul>
            <li>IP address (anonymized or partially masked)</li>
            <li>Browser type</li>
            <li>Device type</li>
            <li>Operating system</li>
            <li>Pages visited</li>
            <li>Time spent on the site</li>
            <li>Referring pages</li>
        </ul>
        <p>This information is collected for: Feature improvement, Security, Analytics, and Preventing abuse (e.g., API spam, DDOS attacks).</p>

        <h2>2. Use of Your Information</h2>
        <p>We use your information to:</p>
        <ul>
            <li>Provide and operate tools</li>
            <li>Improve website performance</li>
            <li>Diagnose issues or bugs</li>
            <li>Analyze user behaviour</li>
            <li>Protect from misuse or fraud</li>
            <li>Improve quality and accuracy of tools</li>
            <li>Enhance AI performance (aggregate & anonymized only)</li>
        </ul>
        <p>We do not sell your personal data.</p>

        <h2>3. File Upload Tools</h2>
        <p>Tools like PDF to Word, Image Compressor, Background Remover, Invoice → Excel Extractor, and Excel Power Tools require file uploads to function.</p>
        <ul>
            <li>✔ Uploaded files are processed temporarily</li>
            <li>✔ Files are NOT stored permanently</li>
            <li>✔ Files are NOT shared with third parties</li>
            <li>✔ Files are deleted automatically after processing</li>
        </ul>
        <p>We do not review or access your content manually.</p>

        <h2>4. AI Tools</h2>
        <p>Tools like AI Humanizer, AI Tutor, AI Product Description Generator, chat-based tools, text analyzers, and SEO content tools may send your content to secure third-party AI APIs (OpenAI, Google AI, Anthropic, etc.).</p>
        <ul>
            <li>✔ Data is only used to generate your output</li>
            <li>✔ We do not train models on your data</li>
            <li>✔ Content is not stored permanently</li>
            <li>✔ Content is not shared or published</li>
        </ul>
        <p>We follow the privacy rules of respective AI providers.</p>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>We use essential cookies for website functionality, analytics cookies (like Google Analytics), and performance cookies to measure tool speed. We do not use advertising or behavioral tracking cookies. You can disable cookies in your browser settings.</p>

        <h2>6. Third-Party Services</h2>
        <p>We may use trusted third-party services like AI model providers, CDNs (Cloudflare, Vercel), analytics tools, and payment processors (if subscriptions are added). These services follow their own privacy policies.</p>

        <h2>7. Data Security</h2>
        <p>We use HTTPS everywhere, firewalls, secure file processing servers, automatic file deletion systems, and access control for backend systems. While no method is 100% secure, we take all reasonable measures to protect your data.</p>

        <h2>8. Children's Privacy</h2>
        <p>All2ools is not intended for children under 13. We do not knowingly collect information from children. If you believe a child has provided data, contact us and we will delete it immediately.</p>

        <h2>9. Your Rights</h2>
        <p>Depending on your region (GDPR, CCPA), you have rights to access, delete, or correct your data. To exercise these rights, contact: <a href="mailto:support@all2ools.com">support@all2ools.com</a>.</p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy as we add new tools. The “Last Updated” date at the top indicates when it was last modified.</p>

        <h2>11. Contact Us</h2>
        <p>If you have questions about this Privacy Policy or data usage, contact us:</p>
        <ul>
            <li>📩 Email: <a href="mailto:support@all2ools.com">support@all2ools.com</a></li>
            <li>🌐 <a href="/contact">https://all2ools.com/contact</a></li>
        </ul>
        <p>We respond within 24–48 hours.</p>
      </div>
    </div>
  );
}
