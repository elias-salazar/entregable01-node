const http = require("http");
const path = require("path");
const fs = require("fs/promises");

const PORT = 8000;
//! utilizo el path para pasarle el id del elemento a eliminar
//! ejemplo localhost:800/taks/id

const app = http.createServer(async (request, response) => {
  const method = request.method;
  const url = request.url;
  if (url.includes("/tasks")) {
    const jsonPath = path.resolve("./data.json");
    const jsonFile = await fs.readFile(jsonPath, "utf8");
    if (method === "GET" && url === "/tasks") {
      response.setHeader("Content-Type", "application/json");
      response.writeHead("200");
      response.write(jsonFile);
    }
    if (method === "POST") {
      request.on("data", (data) => {
        const newTask = JSON.parse(data);
        const arr = JSON.parse(jsonFile);
        arr.push(newTask);
        fs.writeFile(jsonPath, JSON.stringify(arr));
      });
      response.writeHead("201");
    }
    if (method === "PUT") {
      request.on("data", (data) => {
        const id = path.basename(url);
        const newStatus = JSON.parse(data);
        const arr = JSON.parse(jsonFile);

        arr.forEach((element) => {
          if (element.id == id) {
            element.status = newStatus.status;
          }
        });
        fs.writeFile(jsonPath, JSON.stringify(arr));
      });
      response.writeHead("201"); //el la documentacion dece "Ésta es típicamente la respuesta enviada después de una petición PUT." no es que copie el de arriba :v
    }
    if (method === "DELETE") {
      const id = path.basename(url);
      const arr = JSON.parse(jsonFile);
      const newArr = arr.filter((element) => element.id != id);
      fs.writeFile(jsonPath, JSON.stringify(newArr));
      response.writeHead("200");
    }
  }

  response.end();
});

app.listen(PORT);
