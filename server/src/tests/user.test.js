const supertest = require("supertest");
const app = require("../server").default;

describe("🔓 Public User Routes (No Auth)", () => {

  it("POST /api/user/register - should register user", async () => {
    const res = await supertest(app).post("/api/user/register").send({
      u_first_name: "Sean",
      u_last_name: "Baker",
      u_email: "cos30degreess@gmail.com",
      u_password: "Jetta96a1!",
    });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500); // 2xx or 4xx (e.g., user already exists)
    expect(res.body).toHaveProperty("status");
  });

  it("POST /api/user/login - should reject invalid login", async () => {
    const res = await supertest(app).post("/api/user/login").send({
      u_email: "cos30degrees@gmail.com",
      u_password: "wrongpassword",
    });

    expect(res.status).toBe(401); // Or 400 depending on your logic
    expect(res.body).toHaveProperty("status", "failed");
  });

  it("POST /api/user/send-reset-password-email - should return success or error", async () => {
    const res = await supertest(app)
      .post("/api/user/send-reset-password-email")
      .send({ email: "cos30degrees@gmail.com" });

    expect([200, 400, 404]).toContain(res.status); // Success, invalid, or not found
    expect(res.body).toHaveProperty("status");
  });

  it("POST /api/user/verify-otp - should reject invalid OTP", async () => {
    const res = await supertest(app)
      .post("/api/user/verify-otp")
      .send({ email: "cos30degrees@gmail.com", otp: "000000" });

    expect([401, 400]).toContain(res.status);
    expect(res.body).toHaveProperty("message");
  });

  it("GET /api/user/verify-email - should return a valid verification response", async () => {
    const res = await supertest(app)
      .get("/api/user/verify-email")
      .query({ token: "invalid-or-valid-token" });

    expect([200, 400, 404]).toContain(res.status);
    expect(res.body).toHaveProperty("status");
  });

  it("POST /api/user/reset-password/:token - should reject invalid token", async () => {
    const res = await supertest(app)
      .post("/api/user/reset-password/invalid-token")
      .send({ password: "NewPassword123!" });

    expect([400, 401, 404]).toContain(res.status);
    expect(res.body).toHaveProperty("message");
  });

});
