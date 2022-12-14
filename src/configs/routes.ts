export const routers = {
  users: "/users",
  projects: "/projects",
};

export const endpoints = {
  logIn: "/log-in",
  signUp: "/sign-up",
  getAll: "/all",
  getUserData: "/:userId",
  addFriend: "/:friendId",

  allProjects: "/all",
  projectById: "/:projectId",
  createProject: "/new",
  projectsByAuthor: "/author/:userId",
  deleteProject: "/delete/:projectId",
  updateProject: "/update/:projectId",
};

export const queries = {
  offset: {
    type: "number",
    default: 0,
  },
  limit: {
    type: "number",
    default: 10,
  },
  technology: {
    type: "string",
    default: "",
  },
};
