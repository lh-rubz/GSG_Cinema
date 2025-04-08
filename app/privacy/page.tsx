import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Mail, Phone, MapPin, Cookie, Lock, Globe, Calendar, Info, Baby } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | CineHub",
  description: "Privacy policy for CineHub services",
}


export default async  function PrivacyPage() {

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
      <div className="bg-white dark:bg-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">Privacy Policy</h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-300">
              Last updated: March 23, 2024
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <Section icon={<Info size={20} />} title="1. Introduction">
              <p>
                At CineHub, we value your privacy and are committed to protecting your personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard your information when you use our website,
                mobile applications, and services.
              </p>
            </Section>

            <Section icon={<Cookie size={20} />} title="2. Information We Collect">
              <p className="font-medium">2.1 Personal Information:</p>
              <p>We may collect personal information that you provide directly to us, including:</p>
              <ul>
                <li>Contact information (name, email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Demographic information (age, gender)</li>
                <li>Preferences and interests</li>
                <li>Feedback and correspondence</li>
              </ul>

              <p className="font-medium mt-6">2.2 Automatically Collected Information:</p>
              <p>When you use our services, we may automatically collect certain information, including:</p>
              <ul>
                <li>Device information (device type, operating system, browser type)</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>IP address and location information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </Section>

            <Section icon={<Lock size={20} />} title="3. Data Security">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                over the Internet or electronic storage is 100% secure.
              </p>
            </Section>

            <Section  title="4. Children's Privacy" icon={<Baby size={20}/>} >
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe that your child has
                provided us with personal information, please contact us.
              </p>
            </Section>

            <Section icon={<Globe size={20} />} title="5. International Data Transfers">
              <p>
                Your information may be transferred to and processed in countries other than the one in which you reside.
                These countries may have different data protection laws.
              </p>
            </Section>

            <Section icon={<Calendar size={20} />} title="6. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </Section>

            <Section icon={<Mail size={20} />} title="7. Contact Us">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span>privacy@cineHub.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span>(970) 123-4567-510</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                  <span>Icon mall, Surda, Ramallah, Palestine🍉</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Link href="/contact" className="text-red-600 dark:text-red-400 hover:underline flex items-center">
                    <span>Visit Contact Page</span>
                  </Link>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </main>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center mb-4">
        <div className="mr-3 text-red-600 dark:text-red-400">
          {icon}
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="pl-9">
        {children}
      </div>
    </section>
  )
}