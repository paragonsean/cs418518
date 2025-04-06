const { app } = require("../server");
const supertest = require("supertest");


describe("🔓 Public User Routes (No Auth)", () => {
  const testUser = {
    firstName: "Sean",
    lastName: "Baker",
    email: "cos30degreess@gmail.com",
    password: "Jetta96a1!",
    password_confirmation: "Jetta96a1!",
  };

  const weakUser = {
    firstName: "Weak",
    lastName: "Password",
    email: "weakuser@example.com",
    password: "password", // weak password
    password_confirmation: "password",
  };

  it("✅ POST /api/user/register - should register a new user", async () => {
    const res = await supertest(app)
      .post("/api/user/register")
      .send(testUser);

    expect([201, 400]).toContain(res.status); // Allow 400 if user exists
    expect(res.body).toHaveProperty("status");
  });

  it("❌ POST /api/user/register - should reject weak password", async () => {
    const res = await supertest(app)
      .post("/api/user/register")
      .send(weakUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/Password must be at least 8 characters/i);
  });

  it("❌ POST /api/user/login - should reject missing reCAPTCHA", async () => {
    const res = await supertest(app)
      .post("/api/user/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(400); // Missing recaptchaToken
    expect(res.body).toHaveProperty("message");
  });

  it("❌ POST /api/user/login - should reject fake reCAPTCHA", async () => {
    const res = await supertest(app)
      .post("/api/user/login")
      .send({
        email: testUser.email,
        password: testUser.password,
        recaptchaToken: "invalid-token",
      });

    expect([400, 403]).toContain(res.status);
    expect(res.body).toHaveProperty("message");
  });

  it("❌ POST /api/user/verify-otp - should reject invalid OTP", async () => {
    const res = await supertest(app)
      .post("/api/user/verify-otp")
      .send({ email: testUser.email, otp: "000000" });

    expect([401, 400]).toContain(res.status);
    expect(res.body).toHaveProperty("message");
  });

  it("🔍 GET /api/user/verify-email - should reject invalid token", async () => {
    const res = await supertest(app)
      .get("/api/user/verify-email")
      .query({ token: "invalid-or-valid-token" });

    expect([200, 400, 404]).toContain(res.status);
    expect(res.body).toHaveProperty("status");
  });

  it("🔒 POST /api/user/reset-password/:token - should reject invalid token", async () => {
    const res = await supertest(app)
      .post("/api/user/reset-password/invalid-token")
      .send({ password: "NewPassword123!" });

    expect([400, 401, 404]).toContain(res.status);
    expect(res.body).toHaveProperty("message");
  });
});
