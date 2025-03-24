"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Clock, User, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 1500)
  }

  return (
    <main className="min-w-full mx-auto py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="mx-auto max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-colors duration-200">
        <h1 className="text-4xl font-bold mb-6 text-center text-red-600 dark:text-red-400">Contact Us</h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Fill out the form below or use our contact
          information.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 transition-colors duration-200">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">Visit Us</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Icon Mall, Ramallah
                      <br />
                      Palestine
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">Email Us</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      info@cineHub.com
                      <br />
                      support@cineHub.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">Call Us</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Main: (970) 123-4567-510
                      <br />
                      Support: (970) 987-6543-510
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl transition-colors duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Hours</h3>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Monday - Thursday</span>
                  <span className="font-medium">10:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Friday - Saturday</span>
                  <span className="font-medium">10:00 AM - 12:00 AM</span>
                </li>
                <li className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Sunday</span>
                  <span className="font-medium">11:00 AM - 10:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            {isSubmitted ? (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center transition-colors duration-200">
                <div className="bg-red-500 rounded-full p-3 mb-4 inline-block">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Message Sent!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full pl-10 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <select
                    onChange={(e) => handleSelectChange(e.target.value)}
                    value={formState.subject}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="business">Business Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={6}
                      required
                      value={formState.message}
                      onChange={handleChange}
                      className="resize:none! w-full pl-10 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Google Map with Marker */}
   {/* Google Map with Marker */}
<div className="mt-12">
  <h3 className="text-xl font-medium mb-6 text-center text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
    <MapPin className="h-5 w-5" />
    Find Us on the Map
  </h3>
  <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
    <iframe
      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3382.242783596073!2d35.19261302883546!3d31.936502387698987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDU2JzExLjQiTiAzNcKwMTEnMzMuNCJF!5e0!3m2!1sen!2s!4v1621920594152!5m2!1sen!2s&markers=color:red%7C31.936502,35.192613`}
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="dark:grayscale-[20%] dark:opacity-90"
    />
  </div>
  <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
   Icon Mall, Surda ,Ramallah, Palestine 🍉
  </p>
</div>
      </div>
    </main>
  )
}