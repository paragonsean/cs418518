import supertest from "supertest";
import { app } from "../server.js"; // Ensure server.js uses ESM and exports `app`

// Base route prefix (adjust if your API routes are mounted under /api)
const base = "/api";

describe("\n🧪 Testing courses.js", () => {
  describe("PUT /courses/prerequisite/:level", () => {
    it("should remove prerequisites and return 200", async () => {
      const response = await supertest(app)
        .put(`${base}/courses/prerequisite/CS 330`)
        .send({ prerequisite: "None" });

      expect(response.status).toBe(200);
    });

    it("should add prerequisites and return 200", async () => {
      const response = await supertest(app)
        .put(`${base}/courses/prerequisite/CS 330`)
        .send({ prerequisite: "CS 250, CS 252" });

      expect(response.status).toBe(200);
    });
  });

  describe("GET /courses/:level", () => {
    it("should return 200 if course exists", async () => {
      const response = await supertest(app).get(`${base}/courses/CS 418`);
      expect(response.status).toBe(200);
    });

    it("should return 404 if course not found", async () => {
      const response = await supertest(app).get(`${base}/courses/CS 111`);
      expect(response.status).toBe(404);
    });
  });

  describe("GET /courses", () => {
    it("should return all courses with 200", async () => {
      const response = await supertest(app).get(`${base}/courses`);
      expect(response.status).toBe(200);
    });
  });

  describe("POST /courses", () => {
    it("should create a course and return 200", async () => {
      const response = await supertest(app)
        .post(`${base}/courses`)
        .send({
          course_name: "Elementary Computer Science",
          course_level: "CS 098",
          prerequisite: "None",
          course_lvlGroup: "000"
        });

      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /courses/:level", () => {
    it("should delete a course and return 200", async () => {
      const response = await supertest(app).delete(`${base}/courses/CS 098`);
      expect(response.status).toBe(200);
    });
  });
});

describe("\n🧪 Testing user.js", () => {
  describe("GET /user/:email", () => {
    it("should return 200 if user is found", async () => {
      const response = await supertest(app).get(`${base}/user/enova003@odu.edu`);
      expect(response.status).toBe(200);
    });

    it("should return 404 if user is not found", async () => {
      const response = await supertest(app).get(`${base}/user/null@test.com`);
      expect(response.status).toBe(404);
    });
  });
});

describe("\n🧪 Testing login.js", () => {
  describe("POST /login", () => {
    it("should return 401 on invalid login", async () => {
      const response = await supertest(app)
        .post(`${base}/login`)
        .send({ u_email: "enova003@odu.edu", u_password: "1111" });

      expect(response.status).toBe(401);
    });
  });
});

describe("\n🧪 Testing courseadvising.js", () => {
  describe("GET /courseadvising", () => {
    it("should return all records with 200", async () => {
      const response = await supertest(app).get(`${base}/courseadvising`);
      expect(response.status).toBe(200);
    });
  });
});
