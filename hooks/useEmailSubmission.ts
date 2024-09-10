import { useState } from 'react';

interface EmailData {
  name: string;
  email: string;
  message: string;
}

interface SubmissionResult {
  success: boolean;
  message: string;
}

export const useEmailSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitEmail = async (data: EmailData): Promise<SubmissionResult> => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          ...data,
        }),
      });

      const json = await response.json();
      return {
        success: json.success,
        message: json.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "An error occurred. Please try again later.",
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitEmail, isSubmitting };
};
