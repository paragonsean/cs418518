const isValidJWT = (token) => {
  if (typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [header, payload, signature] = parts;
  if (!header || !payload || !signature) {
    return false;
  }

  try {
    //  Decode JWT parts safely
    const decodedHeader = JSON.parse(
      Buffer.from(header, "base64").toString("utf-8"),
    );
    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64").toString("utf-8"),
    );

    if (!decodedHeader || !decodedPayload) {
      return false;
    }

    //  Ensure essential claims exist (optional but recommended)
    if (!decodedPayload.exp || !decodedPayload.iat) {
      console.error(" JWT is missing 'exp' or 'iat' claims");
      return false;
    }

    //  Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp < currentTime) {
      console.error(" JWT has expired");
      return false;
    }

    return true;
  } catch (error) {
    console.error(" Invalid JWT:", error);
    return false;
  }
};

export default isValidJWT;
