
"use client"
import { useState } from "react"



export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Find answers to common questions about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden transition-all duration-200"
            >
              <button
                className={`w-full flex justify-between items-center p-6 text-left focus:outline-none ${activeIndex === index ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                  {item.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-zinc-500 dark:text-zinc-400 transform transition-transform duration-200 ${activeIndex === index ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              <div
                id={`faq-content-${index}`}
                className={`px-6 pb-6 pt-0 text-zinc-600 dark:text-zinc-300 transition-all duration-200 overflow-hidden ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="pt-2">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-sm text-center">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            Need more help?
          </h3>
          <p className="text-zinc-600 dark:text-zinc-300 mb-6">
            Our team is ready to assist you with any questions.
          </p>
          <a
            href="/contact"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  )
}

const faqItems = [
    {
      question: "🎟️ How do I book tickets online?",
      answer: "Booking tickets online is simple! Visit our website or mobile app, select your preferred movie, showtime, and seats. Follow the checkout process to complete your payment. You'll receive an email confirmation with your ticket details and QR code for entry."
    },
    {
      question: "💸 Are there any discounts available for tickets?",
      answer: "Yes, we offer various discounts for students, senior citizens, and special promotions. Please visit our Promotions page for current offers and detailed information about ticket discounts. 🎉"
    },
    {
      question: "🎥 Can I choose my seat when booking tickets?",
      answer: "Of course! You can choose your preferred seat when booking tickets online or through our app. We offer reserved seating for most shows, so you can pick the perfect spot! 🪑"
    },
    {
      question: "🔄 What is the refund policy for tickets?",
      answer: "Tickets are non-refundable once purchased, but you can exchange your tickets for another showtime or movie if requested at least 24 hours before the scheduled showtime. Please contact our customer service for assistance. 😊"
    },
    {
      question: "⏰ How can I find out the movie showtimes?",
      answer: "Movie showtimes are available on our website and mobile app. You can filter by date, movie, or theater location to find the best time for you. 📅"
    },
    {
      question: "🍿 Can I bring food and drinks into the theater?",
      answer: "Outside food and drinks are not allowed in the theater for health and safety reasons. However, our cinema provides a wide range of delicious snacks and drinks available for purchase! 😋🍫"
    },
    {
      question: "🔞 Are there any age restrictions for movies?",
      answer: "Yes, movies may have age restrictions depending on their content. You can check the movie's rating on our website or app before booking. If you're underage, an adult may need to accompany you to certain movies. 👶👩‍🦳"
    },
    {
      question: "🎁 How do I redeem my discount or promo code?",
      answer: "To redeem a discount or promo code, enter the code during the checkout process on our website or app. The discount will be applied to your total purchase before payment. 💸"
    },
    {
      question: "🎬 Do you offer gift cards for the cinema?",
      answer: "Yes, we offer gift cards that can be used to purchase tickets, food, and drinks at the cinema. Visit our website or customer service desk to purchase a gift card today! 🎁"
    },
    {
      question: "🌟 Can I watch movies in 3D or IMAX?",
      answer: "Yes, we offer select movies in 3D and IMAX formats. You can filter movie showtimes on our website to see which movies are available in these formats. 🍿🎥"
    },
    {
      question: "💳 Can I pay with my credit card?",
      answer: "Absolutely! We accept a variety of payment methods including credit cards, debit cards, and mobile wallets for your convenience. 💳"
    },
    {
      question: "🚗 Is parking available at the cinema?",
      answer: "Yes, we offer ample parking space at our cinema for your convenience. Just park your car and enjoy the movie! 🅿️"
    },
    {
      question: "💡 How do I find the nearest theater?",
      answer: "You can find the nearest theater by visiting our website or mobile app. Enter your location, and we'll show you the closest cinemas and their movie listings. 🌍"
    },
    {
      question: "🕹️ Do you offer gaming nights or events?",
      answer: "Yes! We host special events like gaming nights, movie marathons, and theme nights. Stay tuned on our website and social media for upcoming events. 🎮🍿"
    },
    {
      question: "🛍️ Can I buy tickets as a gift for someone?",
      answer: "Yes, you can purchase tickets as a gift! Simply choose the tickets you'd like to buy and select 'Gift' during the checkout process. You'll receive a gift card to present to the recipient. 🎁"
    },
    {
      question: "👨‍👩‍👧‍👦 Do you have family-friendly movies?",
      answer: "Yes, we offer a wide selection of family-friendly movies. You can find these movies listed under the 'Family' category on our website or app. 👶🎬"
    },
    {
      question: "🛋️ Do you have luxury seating options?",
      answer: "Yes, we offer premium seating options for a more luxurious movie experience. These seats provide extra comfort, and you can reserve them when booking your tickets. 🛋️"
    },
    {
      question: "🎉 Can I book a theater for a private event?",
      answer: "Yes, you can book our theater for private screenings, corporate events, or birthday parties! Contact us for more details and availability. 🎈🍿"
    }
  ]
  