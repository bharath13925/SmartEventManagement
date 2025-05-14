import React, { useState } from 'react';
import '../pages/styles/ContactForm.css';

const ContactForm = () => {
  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResponseMessage('');
    setIsSuccess(false);

    // Prepare the email data
    const emailData = { from, subject, text };

    try {
      // Send email to the backend API
      const response = await fetch('http://localhost:5000/api/users/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.status === 200) {
        setIsSuccess(true);
        setResponseMessage(`Email sent successfully!`);
        // Clear form after successful submission
        setFrom('');
        setSubject('');
        setText('');
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-form-container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from">Your Email:</label>
          <input
            type="email"
            id="from"
            name="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="text">Message:</label>
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows="6"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {responseMessage && (
        <div className={`response ${isSuccess ? 'success' : 'error'}`}>
          <h3>Response:</h3>
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;