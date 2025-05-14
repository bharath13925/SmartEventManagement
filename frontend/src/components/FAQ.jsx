import React from 'react';
import './FAQ.css';

const faqData = [
  {
    question: 'How do I book an event?',
    answer: 'You can book events by logging in as a user and navigating to the available events section.'
  },
  {
    question: 'Can I create my own event?',
    answer: 'Yes, organizers can log in and create events, set capacity, price, and more.'
  },
  {
    question: 'How do I check-in at the event?',
    answer: 'Once booked, your ticket will have a QR code. Show it at the entry to get scanned.'
  },
  {
    question: 'Is real-time tracking available?',
    answer: 'Yes, organizers can view real-time attendance and ticket sales in their dashboard.'
  },
  {
    question: 'Can I cancel my ticket?',
    answer: 'Ticket cancellation is subject to event policy. Check event details before booking.'
  }
];

const FAQ = () => {
  return (
    <div className="faq-section" id="faq">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question">{item.question}</div>
          <div className="faq-answer">{item.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
