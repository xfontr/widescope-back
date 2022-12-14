import ProtoProject from "../../controllers/types/projectControllers";
import mockProject from "./mockProject";

const mockProtoProject: ProtoProject = {
  name: mockProject.name,
  author: mockProject.author,
  authorId: mockProject.authorId,
  description: mockProject.description,
  repository: mockProject.repository,
  technologies: mockProject.technologies,
  logo: mockProject.logo,
  logoBackup: mockProject.logoBackup,
};

export default mockProtoProject;
