// middleware/recaptcha.js
import { verifyRecaptcha } from "../services/verify_recaptcha.js";
import logger from "../services/my_logger.js";
const MIN_SCORE = parseFloat(process.env.RECAPTCHA_MIN_SCORE || "1.5");

/**
 * recaptcha(actionName)
 *   - actionName: the 'action' you passed to grecaptcha.execute(...) on the client
 */
export function recaptcha(actionName) {
  return async function (req, res, next) {
    const token = req.body.recaptchaToken;
    if (!token) {
      return res.status(400).json({
        status: "failed",
        message: "Missing reCAPTCHA token"
      });
    }
    try {
      const result = await verifyRecaptcha(token);
      logger.info(`reCAPTCHA result for ${actionName}: ${JSON.stringify(result)}`);
      if (!result.success || result.action !== actionName || result.score < MIN_SCORE) {
        logger.warn(`reCAPTCHA (${actionName}) failed — action: ${result.action}, score: ${result.score}`);
        return res.status(403).json({
          status: "failed",
          message: "reCAPTCHA verification failed. Are you human?"
        });
      }
      next();
    } catch (err) {
      logger.error(`Error verifying reCAPTCHA: ${err.message}`);
      return res.status(500).json({
        status: "failed",
        message: "reCAPTCHA error"
      });
    }
  };
}