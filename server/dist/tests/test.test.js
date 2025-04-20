import axios from "axios";
const BASE_URL = "https://newstudentportal-backend.ngrok.io/api/courses";
describe("🔗 Live Course API", () => {
  it("GET / - fetch all courses", async () => {
    const res = await axios.get(BASE_URL);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });
  it("GET /CS 418 - fetch course by level", async () => {
    const res = await axios.get(`${BASE_URL}/CS 418`);
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("course_level", "CS 418");
  });
  it("PUT /prerequisite/CS 330 - update prerequisites", async () => {
    const res = await axios.put(`${BASE_URL}/prerequisite/CS 330`, {
      prerequisite: "CS 150, CS 252"
    });
    expect(res.status).toBe(200);
  });
  it("DELETE /CS 098 - delete course", async () => {
    const res = await axios.delete(`${BASE_URL}/CS 098`);
    expect(res.status).toBe(200);
  });
});