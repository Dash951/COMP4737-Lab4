const http = require("http");
const fs = require("fs");
const Utils = require("./modules/utils");
const messages = require("./lang/en/en");

class Server {
  constructor(port) {
    this.port = port;
    this.utils = new Utils();
  }

  start() {
    http.createServer((req, res) => {
      this.handle(req, res);
    }).listen(this.port);
    console.log("Listening on port " + this.port);
  }

  handle(req, res) {
    const link = new URL(req.url, "http://localhost");
    const path = link.pathname;

    if (path.startsWith("/COMP4537/labs/4/getDate")) {
      this.getDate(res, link);
    } else if (path.startsWith("/COMP4537/labs/4/writeFile")) {
      this.writeFile(res, link);
    } else if (path.startsWith("/COMP4537/labs/4/readFile/")) {
      this.readFile(res, path);
    } else {
      this.send(res, 404, messages.routeNotFound);
    }
  }

  getDate(res, link) {
    const name = link.searchParams.get("name");
    this.send(res, 200, this.utils.getDate(name), "text/html");
  }

  writeFile(res, link) {
    const text = link.searchParams.get("text");
    // appendFile creates the file if it is missing, otherwise adds to the end
    fs.appendFile("file.txt", text + "\n", (err) => {
      this.send(res, 200, "Added: " + text);
    });
  }

  readFile(res, path) {
    const fileName = path.split("/").pop();
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        this.send(res, 404, messages.fileNotFound.replace("%placeholder", fileName));
      } else {
        this.send(res, 200, data);
      }
    });
  }

  send(res, status, body, type) {
    res.writeHead(status, { "Content-Type": (type || "text/plain") + "; charset=utf-8" });
    res.end(body);
  }
}

// starter
new Server(process.env.PORT || 8000).start();