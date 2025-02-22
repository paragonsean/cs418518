const request = require("supertest");
const express = require("express");
const router = require("./user");
const database = require("../database");
const { hashPassword } = require("../utils/helper");


jest.mock("../database");
jest.mock("../utils/helper");

const app = express();
app.use(express.json());
app.use("/user", router);

describe("User Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("GET /user should return all users", async () => {
        const users = [{ id: 1, name: "John Doe" }];
        database.execute.mockImplementation((query, callback) => {
            callback(null, users);
        });

        const response = await request(app).get("/user");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(users);
    });

    it("POST /user should create a new user", async () => {
        const newUser = {
            u_first_name: "John",
            u_last_name: "Doe",
            u_email: "john.doe@example.com",
            u_password: "password123",
        };
        const hashedPassword = "hashedPassword123";
        hashPassword.mockReturnValue(hashedPassword);
        database.execute.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).post("/user").send(newUser);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 200,
            message: "User successfully created! You are currently waiting to be approved by our admin",
        });
    });

    it("PUT /user/:email should update user password", async () => {
        const email = "john.doe@example.com";
        const newPassword = "newPassword123";
        const hashedPassword = "hashedNewPassword123";
        hashPassword.mockReturnValue(hashedPassword);
        database.execute.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).put(`/user/${email}`).send({ u_password: newPassword });

        expect(response.status).toBe(200);
        expect(response.text).toBe("Password successfully found and updated.");
    });

    it("PUT /user/id/:id should update user first and last name", async () => {
        const id = 1;
        const updatedUser = {
            u_first_name: "Jane",
            u_last_name: "Doe",
        };
        database.execute.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).put(`/user/id/${id}`).send(updatedUser);

        expect(response.status).toBe(200);
        expect(response.text).toBe("Record updated successfully");
    });

    it("GET /user/:email should return user by email", async () => {
        const email = "john.doe@example.com";
        const user = { id: 1, u_email: email };
        database.execute.mockImplementation((query, values, callback) => {
            callback(null, [user]);
        });

        const response = await request(app).get(`/user/${email}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([user]);
    });

    it("DELETE /user/:id should delete user by id", async () => {
        const id = 1;
        database.execute.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).delete(`/user/${id}`);

        expect(response.status).toBe(200);
        expect(response.text).toBe("Record deleted successfully!");
    });

    it("GET /user/approved/:approved should return users that are not approved", async () => {
        const users = [{ id: 1, is_approved: 0 }];
        database.execute.mockImplementation((query, callback) => {
            callback(null, users);
        });

        const response = await request(app).get("/user/approved/0");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(users);
    });

    it("PUT /user/approved/:id should update user to approved status", async () => {
        const id = 1;
        const isApproved = 1;
        database.execute.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).put(`/user/approved/${id}`).send({ is_approved: isApproved });

        expect(response.status).toBe(200);
        expect(response.text).toBe("Record updated successfully");
    });
});
