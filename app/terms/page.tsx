import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | CineHub",
  description: "Terms and conditions for using CineHub services",
}

export default function TermsPage() {
  return (
    <main className="py-20! md:py-20 lg:py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-red-600 dark:text-red-500 tracking-tight mb-6">
          Terms and Conditions
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Last updated: March 23, 2024</p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Welcome to CineHub! These Terms and Conditions govern your use of our website, mobile applications, and
              services. By accessing or using CineHub, you agree to be bound by these Terms. If you disagree with any part
              of these terms, you may not access our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>"CineHub"</strong> refers to our company, our website, mobile applications, and services.</li>
              <li><strong>"Services"</strong> refers to movie screenings, concessions, and any other products or services offered by CineHub.</li>
              <li><strong>"User"</strong> refers to any individual who accesses or uses our services.</li>
              <li><strong>"Content"</strong> refers to text, images, videos, audio, and other materials that appear on our platforms.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">3. Use of Services</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                3.1 <strong>Eligibility:</strong> You must be at least 13 years old to use our services. If you are under 18, you must have parental consent.
              </p>
              <p>
                3.2 <strong>Account Creation:</strong> Some services require account registration. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
              </p>
              <p>
                3.3 <strong>Prohibited Activities:</strong> You agree not to:
              </p>
              <ul className="list-disc pl-8 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Distribute harmful content or malware</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Disrupt or interfere with the service or servers</li>
                <li>Engage in any activity that could damage or impair the functionality of our services</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">4. Ticket Purchases and Refunds</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                4.1 <strong>Ticket Sales:</strong> All ticket sales are final once confirmed. Prices are subject to change without notice.
              </p>
              <p>
                4.2 <strong>Cancellations:</strong> Tickets may be canceled up to 4 hours before the showtime for a full refund. After this time, no refunds will be issued except in cases of technical failures or canceled screenings.
              </p>
              <p>
                4.3 <strong>Rescheduling:</strong> In the event of a canceled screening, CineHub will offer either a refund or the option to reschedule for another showtime.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">5. Intellectual Property</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                5.1 <strong>Ownership:</strong> All content on our platforms, including logos, designs, text, graphics, and software, is the property of CineHub or its licensors and is protected by copyright and other intellectual property laws.
              </p>
              <p>
                5.2 <strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes.
              </p>
              <p>
                5.3 <strong>Restrictions:</strong> You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from our platforms without explicit permission.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">6. Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you consent to our data practices as described in our Privacy Policy.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">7. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                7.1 <strong>Disclaimer:</strong> CineHub provides its services "as is" and "as available" without warranties of any kind, either express or implied.
              </p>
              <p>
                7.2 <strong>Limitation:</strong> To the maximum extent permitted by law, CineHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">8. Indemnification</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You agree to indemnify and hold harmless CineHub and its affiliates, officers, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of our services or violation of these Terms.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">9. Modifications</h2>
            <p className="text-gray-700 dark:text-gray-300">
              CineHub reserves the right to modify these Terms at any time. We will provide notice of significant changes. Your continued use of our services after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">10. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which CineHub is registered, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Section 11 */}
          <section className="bg-gray-100 dark:bg-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about these Terms, please contact us at legal@cinehub.com or through our Contact Us page.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
