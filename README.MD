# Widescope

[Widescope](https://xfont-final-project-202207-bcn.netlify.app/home) is a platform to share app projects between the users. The users can create, read, update and delete their own projects. As an additional feature, it is possible to speak to another using with a chat.

The technologies used for this proyect were:

### 🔸 Front

React | Redux | PWA | Styled Components | Typescript | Jest

### 🔸 Back

NodeJS | ExpressJS | MongoDB | Mongoose | JWT | Firebase | Jest | Supertest

### 🔸 Tools

Trello | Postman | Figma | Sonar Cloud

## Metrics

🚀 GTMetrix

**Optimized with react component lazy loading**

<img src="https://i.imgur.com/yVPOWop.png" width="300">
<img src="https://i.imgur.com/ree44Mz.png" width="300">

**100% coverage with more than 350 tests**

📈 [Back SonarCloud metrics](https://sonarcloud.io/project/overview?id=isdi-coders-2022_Xifre-Font_Back-Final-Project-202207-BCN)

📈 [Front SonarCloud metrics](https://sonarcloud.io/project/overview?id=isdi-coders-2022_Xifre-Font_Front-Final-Project-202207-BCN)

## Links

🌐✨ [Widescope](https://xfont-final-project-202207-bcn.netlify.app/home)

💻🗄 [Back deploy on Heroku](https://xfont-final-project-202207.herokuapp.com/)

🔗 [Original front repository](https://github.com/isdi-coders-2022/Xifre-Font_Front-Final-Project-202207-BCN)

🔗 [Original back repository](https://github.com/isdi-coders-2022/Xifre-Font_Back-Final-Project-202207-BCN)

## Back endpoints

`🔹 GET ➡️ .../users/all`  
Provides a list with all the users.

`🔹 GET ➡️ .../users/:id`  
Provides a specific user by id.

`🔹 GET ➡️ .../users/:id?friends=all`  
Provides all the friends a user has, with their names and IDs.

`🔹 GET ➡️ .../projects`  
Provides a list with all the projects.

`🔹 GET ➡️ .../projects?technology=angular`  
Provides a list with all the projects that have the technology specified in the query.

`🔹 GET ➡️ .../projects?limit=10&offset=0`  
Uses offset and limit to specify the amount of projects to be provided and the starting point.

`🔹 GET ➡️ .../projects/:id`  
Provides a specific project by id.

`🔹 GET ➡️ .../projects/:user-name`  
Provides a list of users filtered by project.

`🔹 POST ➡️ .../users/log-in`  
It requires a name and a password as a payload, and it responds with a token if the data introduced is verified as a registered user.

`🔹 POST ➡️ .../users/sign-up`  
It requires a name, a password and an email address. It creates a new user in the database.

`🔹 POST ➡️ .../projects/new`  
Posts a new project. It requires a name, a repository URL, a logo, an author name and ID, a back-end technology, a front-end technology and a description.

`🔹 DELETE ➡️ .../projects/delete/:id`  
Deletes the project with specified ID.

`🔹 PUT ➡️ .../projects/update/:id`  
Updates the project with specified ID. It requires the same data required for creating a project, with only the logo being optional.

`🔹 PATCH ➡️ .../users/:friendId`  
It requires authentication, so the requesting user ID will be registered in the request header. This request will add the friend with the specified ID to the client friend list.
