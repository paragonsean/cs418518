"use client";

import { useEffect, useState } from "react";

const ReCaptcha = ({ action, onTokenReceived }) => {
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false); // Track if script has been loaded

  // Load reCAPTCHA v3 script once
  useEffect(() => {
    const scriptId = "recaptcha-script";
    if (document.getElementById(scriptId)) {
      setScriptLoaded(true); // Skip loading if the script is already in the DOM
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    // Cleanup when the component unmounts
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Handle reCAPTCHA token generation
  const handleRecaptcha = async () => {
    if (!scriptLoaded || !window.grecaptcha) {
      console.error("reCAPTCHA script not loaded yet.");
      return;
    }

    try {
      const token = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
            .then(resolve)
            .catch(reject);
        });
      });
      setRecaptchaToken(token); // Store the reCAPTCHA token
      onTokenReceived(token); // Callback to pass token to parent
    } catch (error) {
      console.error("reCAPTCHA error:", error);
    }
  };

  useEffect(() => {
    if (scriptLoaded) {
      handleRecaptcha();
    }
  }, [action, scriptLoaded]);

  return null; // This component does not render anything visible
};

export default ReCaptcha;
