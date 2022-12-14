import "../../../testsSetup";
import request from "supertest";
import app from "../..";
import { User } from "../../../database/models/User";
import mockUser from "../../../test-utils/mocks/mockUser";
import codes from "../../../configs/codes";
import { endpoints } from "../../../configs/routes";
import IUser from "../../../database/types/IUser";

describe(`Given a /users${endpoints.signUp} route`, () => {
  describe("When requested with POST method and user register data", () => {
    test(`Then it should respond with a status of ${codes.created}`, async () => {
      const res = await request(app).post(`/users${endpoints.signUp}`).send({
        name: mockUser.name,
        password: mockUser.password,
        email: mockUser.email,
      });

      expect(res.statusCode).toBe(codes.created);
    });

    test(`Then it should respond with a status of ${codes.badRequest} if the user data is invalid`, async () => {
      const res = await request(app).post(`/users${endpoints.signUp}`).send("");

      expect(res.statusCode).toBe(codes.badRequest);
    });

    test(`Then it should respond with a status of ${codes.conflict} if the user already exists`, async () => {
      await User.create(mockUser);

      const res = await request(app).post(`/users${endpoints.signUp}`).send({
        name: mockUser.name,
        password: mockUser.password,
        email: mockUser.email,
      });

      expect(res.statusCode).toBe(codes.conflict);
    });
  });
});

describe(`Given a /users${endpoints.logIn} route`, () => {
  describe("When requested with POST method and user login data", () => {
    test(`Then it should respond with a status of ${codes.ok}`, async () => {
      await request(app).post(`/users${endpoints.signUp}`).send({
        name: mockUser.name,
        password: mockUser.password,
        email: mockUser.email,
      });

      const res = await request(app).post(`/users${endpoints.logIn}`).send({
        name: mockUser.name,
        password: mockUser.password,
      });

      expect(res.statusCode).toBe(codes.ok);
    });

    test(`Then it should respond with a status of ${codes.badRequest} if the request is not valid`, async () => {
      await request(app).post(`/users${endpoints.signUp}`).send({
        name: mockUser.name,
        password: mockUser.password,
        email: mockUser.email,
      });

      const res = await request(app).post(`/users${endpoints.logIn}`).send("");

      expect(res.statusCode).toBe(codes.badRequest);
    });

    test(`Then it should respond with a status of ${codes.badRequest} if the password is not correct`, async () => {
      await request(app).post(`/users${endpoints.signUp}`).send({
        name: mockUser.name,
        password: mockUser.password,
        email: mockUser.email,
      });

      const res = await request(app)
        .post(`/users${endpoints.logIn}`)
        .send({ name: mockUser.name, password: "" });

      expect(res.statusCode).toBe(codes.badRequest);
    });

    test(`Then it should respond with a status of ${codes.notFound} if the user doesn't exist`, async () => {
      const res = await request(app)
        .post(`/users${endpoints.logIn}`)
        .send({ name: mockUser.name, password: mockUser.password });

      expect(res.statusCode).toBe(codes.notFound);
    });
  });
});

describe(`Given a /users/${endpoints.getUserData} route`, () => {
  describe("When requested with GET method and a user id as param", () => {
    test(`Then it should respond with a status of ${codes.ok}`, async () => {
      let user: IUser;

      await request(app)
        .post(`/users/${endpoints.signUp}`)
        .send({
          name: mockUser.name,
          password: mockUser.password,
          email: mockUser.email,
        })
        .then((data) => {
          user = data.body.newUser;
        });

      const res = await request(app).get(`/users/${user.id}`);

      expect(res.statusCode).toBe(codes.ok);
    });

    test(`Then it should respond with a status of ${codes.notFound} if the user doesn't exist`, async () => {
      const res = await request(app).get(`/users/${mockUser.id}`);

      expect(res.statusCode).toBe(codes.notFound);
    });
  });
});
