import { useState } from 'react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter signup state for the mock content pages. There is no backend, so
 * a valid address only shows a confirmation.
 */
export const useEmailSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const address = email.trim();
    if (!EMAIL_PATTERN.test(address)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setMessage(`Thanks! ${address} is subscribed. (Demo only: no emails are sent.)`);
    setEmail('');
  };

  return { email, setEmail, message, submit };
};
