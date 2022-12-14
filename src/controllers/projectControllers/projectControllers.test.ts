import { NextFunction, Request, Response } from "express";
import codes from "../../configs/codes";
import { queries } from "../../configs/routes";
import { Project } from "../../database/models/Project";
import { User } from "../../database/models/User";
import mockProject from "../../test-utils/mocks/mockProject";
import mockUser from "../../test-utils/mocks/mockUser";
import CreateError from "../../utils/CreateError/CreateError";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getById,
  getProjectsByAuthor,
  updateProject,
} from "./projectControllers";

describe("Given a getAllProjects function", () => {
  const req = {
    query: {},
  } as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn();

  Project.find = jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue([mockProject]),
    }),
  });

  describe("When called with a request, a response and a next function", () => {
    test(`Then it should respond with a status of '${codes.ok}'`, async () => {
      await getAllProjects(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(codes.ok);
    });

    test(`Then it should respond with all the projects found`, async () => {
      const expectedResponse = {
        projects: {
          offset: queries.offset.default,
          limit: queries.limit.default,
          list: [mockProject],
        },
      };
      await getAllProjects(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but the database doesn't return any valid data", () => {
    test("Then it should call next with an error", async () => {
      Project.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(new Error()),
        }),
      });

      const expectedError = new CreateError(
        codes.notFound,
        "No projects found",
        "Error while getting projects: "
      );

      await getAllProjects(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = next.mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });

  describe("When called but there are no projects avaliable", () => {
    test(`Then it should respond informing that there are no projects with code '${codes.notFound}'`, async () => {
      Project.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue([]),
        }),
      });

      const expectedResponse = {
        projects: "No projects found",
      };

      await getAllProjects(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(codes.notFound);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("@hen called with a query of technology 'react'", () => {
    test("Then it should find all projects that have a 'react' as technology", async () => {
      const reqQuery = {
        query: { technology: "react" },
      } as Partial<Request>;

      Project.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue([]),
        }),
      });

      await getAllProjects(
        reqQuery as Request,
        res as Response,
        next as NextFunction
      );

      expect(Project.find).toHaveBeenCalledWith({ technologies: "react" });
    });
  });
});

describe("Given a getById function", () => {
  const req = {
    params: {
      projectId: "#",
    },
  } as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn();

  describe("When called with a request, a response and a next function", () => {
    test(`Then it should respond with a status of '${codes.ok}' and the project found`, async () => {
      Project.findById = jest.fn().mockReturnValue(mockProject);

      const expectedResponse = {
        project: mockProject,
      };

      await getById(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(codes.ok);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Then it should respond with a not found code if no projects were found", async () => {
      Project.findById = jest.fn().mockReturnValue(null);

      const expectedResponse = {
        projects: "No projects found",
      };

      await getById(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(codes.notFound);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but the database find fails", () => {
    test("Then it should call next with an error", async () => {
      Project.findById = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CreateError(
        codes.notFound,
        "No projects found",
        "Error while finding the project requested"
      );

      await getById(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = next.mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });
});

describe("Given a createProject function", () => {
  const req = {
    body: mockProject,
  } as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn();

  Project.create = jest.fn().mockReturnValue(mockProject);
  Project.findByIdAndDelete = jest.fn();

  User.findById = jest
    .fn()
    .mockReturnValue({ id: mockUser.id, projects: mockUser.projects });
  User.findByIdAndUpdate = jest.fn();

  describe("When called with a request, a response and a next function", () => {
    Project.create = jest.fn().mockReturnValue(mockProject);
    User.findById = jest
      .fn()
      .mockReturnValue({ id: mockUser.id, projects: mockUser.projects });
    User.findByIdAndUpdate = jest.fn();
    Project.findByIdAndDelete = jest.fn();

    test(`Then it should respond with a status of '${codes.created}'`, async () => {
      await createProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(codes.created);
    });

    test(`Then it should respond with the project created`, async () => {
      const expectedResponse = {
        projectCreated: mockProject,
      };

      await createProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Then it should modify the author document to add a new project", async () => {
      await createProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockUser.id, {
        projects: [...mockUser.projects, mockProject.id],
      });
    });
  });

  describe("When called but the project creation fails", () => {
    test("Then it should call next with an error", async () => {
      Project.create = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CreateError(
        codes.badRequest,
        "Unable to create the project",
        "Unable to create the project: "
      );
      await createProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = next.mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });

  describe("When called but the author doesn't exist", () => {
    test("Then it should delete the project created", async () => {
      jest.clearAllMocks();

      Project.create = jest.fn().mockReturnValue(mockProject);
      User.findById = jest.fn().mockRejectedValue(new Error());

      await createProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(Project.findByIdAndDelete).toHaveBeenCalledWith(mockProject.id);
    });

    test("Then it should call next wiht a not found error", async () => {
      jest.clearAllMocks();

      Project.create = jest.fn().mockReturnValue(mockProject);
      User.findById = jest.fn().mockRejectedValue(new Error());

      await createProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      const expectedError = new CreateError(
        codes.notFound,
        "Couldn't assign an author to the project",
        "The author doesn't exist"
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = next.mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });
});

describe("Given a getProjectsByAuthor function", () => {
  const req = {
    params: { userId: mockUser.id },
  } as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn();

  describe("When called with a request, a response and a next function as arguments", () => {
    test(`Then it should call status with a status of ${codes.ok}`, async () => {
      Project.find = jest.fn().mockReturnValue(mockUser.projects);

      User.findById = jest
        .fn()
        .mockReturnValue({ id: mockUser.id, projects: mockUser.projects });

      await getProjectsByAuthor(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(codes.ok);
    });

    test("Then it should call json with a list of projects and extra information", async () => {
      Project.find = jest.fn().mockReturnValue(mockUser.projects);

      User.findById = jest
        .fn()
        .mockReturnValue({ id: mockUser.id, projects: mockUser.projects });

      const expectedResponse = {
        projectsByAuthor: {
          author: mockUser.id,
          total: mockUser.projects.length,
          projects: mockUser.projects,
        },
      };

      await getProjectsByAuthor(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When the user requesting does'nt exist", () => {
    test(`It should call next with a ${codes.notFound} error`, async () => {
      User.findById = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CreateError(
        codes.notFound,
        "Unable to get the requested projects",
        "Requesting user doesn't exist"
      );

      await getProjectsByAuthor(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = next.mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });

  describe("When the user requesting has no projects", () => {
    test(`Then it should respond informing that there are no projects with a status of '${codes.notFound}'`, async () => {
      Project.find = jest.fn().mockReturnValue([]);

      User.findById = jest.fn().mockReturnValue({
        id: mockUser.id,
        projects: 0,
      });

      const expectedResponse = {
        projectsByAuthor: {
          author: mockUser.id,
          total: "0 projects",
        },
      };

      await getProjectsByAuthor(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
      expect(res.status).toHaveBeenCalledWith(codes.notFound);
    });
  });

  describe("When it's not possible to get any project from the user", () => {
    test(`Then it should call next with a ${codes.notFound} error`, async () => {
      jest.clearAllMocks();

      User.findById = jest.fn().mockReturnValue({
        id: mockUser.id,
        projects: mockUser.projects,
      });
      Project.find = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CreateError(
        codes.notFound,
        "Unable to get the requested projects",
        `Couldn't get any project: `
      );

      await getProjectsByAuthor(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = next.mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });
});

describe("Given a projectControllers function", () => {
  const req = {
    params: { projectId: mockProject.id },
    body: {
      deleteFromAuthor: true,
      authorProjects: mockUser.projects,
      authorId: mockProject.authorId,
    },
  } as Partial<Request>;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn();

  Project.findByIdAndDelete = jest.fn();

  User.findByIdAndUpdate = jest.fn();

  describe("When called with a request, a response and a next function as arguments", () => {
    test(`Then it should call status with a status of '${codes.deletedWithResponse}'`, async () => {
      await deleteProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(codes.deletedWithResponse);
    });

    test("Then it should respond with a success message", async () => {
      await deleteProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      const expectedResponse = {
        projectDeleted: {
          id: mockProject.id,
          status: "Deleted",
        },
      };

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    test("Then it should delete the project from the author projects", async () => {
      await deleteProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProject.authorId,
        { projects: [mockUser.projects[1]] }
      );
    });
  });

  describe("When called and the request doesn't command to delete the project from the author", () => {
    test("Then it should call the method to delete the project from the user project list", async () => {
      jest.restoreAllMocks();
      jest.clearAllMocks();

      const reqWithoutAuthor = {
        params: { projectId: mockProject.id },
        body: {
          deleteFromAuthor: false,
          authorProjects: undefined,
          authorId: undefined,
        },
      } as Partial<Request>;

      await deleteProject(
        reqWithoutAuthor as Request,
        res as Response,
        next as NextFunction
      );

      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe("When called but an error occurs while deleting the project or updating the user", () => {
    test("Then it should call next with an error", async () => {
      Project.findByIdAndDelete = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CreateError(
        codes.notFound,
        "Couldn't delete any project",
        "Error while deleting the project: "
      );

      await deleteProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a updateProject controller", () => {
  const req = {
    body: { ...mockProject, name: "Updated name" },
    params: { projectId: mockProject.id },
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn();

  Project.replaceOne = jest.fn();

  describe("When called with a request, a response and a next function", () => {
    test(`Then it should respond with a status code of ${codes.updatedWithResponse}`, async () => {
      Project.findById = jest.fn().mockReturnValue(mockProject);

      await updateProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(codes.updatedWithResponse);
    });

    test("Then it should respond with the updated project", async () => {
      Project.findById = jest.fn().mockReturnValue(mockProject);

      const expectedResponse = {
        updatedProject: { ...mockProject, name: "Updated name" },
      };
      await updateProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but it was not possible to update the project", () => {
    test("Then it should call next with an error", async () => {
      Project.findById = jest.fn().mockRejectedValue(new Error());

      await updateProject(
        req as Request,
        res as Response,
        next as NextFunction
      );

      const expectedError = new CreateError(
        codes.badRequest,
        "Couldn't update any project",
        "Error while updating the project: "
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = next.mock.calls[0][0];

      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });
});
