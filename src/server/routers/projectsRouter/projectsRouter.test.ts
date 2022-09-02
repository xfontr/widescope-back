import request from "supertest";
import app from "../..";
import codes from "../../../configs/codes";
import { endpoints } from "../../../configs/routes";
import { Project } from "../../../database/models/Project";
import mockProject from "../../../test-utils/mocks/mockProject";
import "../../../testsSetup";

describe(`Given a /projects${endpoints.getAllProjects} route`, () => {
  describe("When requested with GET method", () => {
    test(`Then it should respond with a status of '${codes.ok}'`, async () => {
      await Project.create({
        name: mockProject.name,
        description: mockProject.description,
        repository: mockProject.repository,
        author: mockProject.author,
        logo: mockProject.logo,
      });

      const res = await request(app).get(
        `/projects${endpoints.getAllProjects}`
      );

      expect(res.statusCode).toBe(codes.ok);
    });

    test(`Then it should respond with a status of '${codes.notFound}' it there are no projects`, async () => {
      const res = await request(app).get(
        `/projects${endpoints.getAllProjects}`
      );

      expect(res.statusCode).toBe(codes.notFound);
    });
  });
});