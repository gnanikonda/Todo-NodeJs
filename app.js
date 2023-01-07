const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "todoApplication.db");
const app = express();
app.use(express.json());

let db = null;

const initialize = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("server is running at port 5000:");
    });
  } catch (e) {
    console.log(`${e.message}`);
  }
};

initialize();

//api 1
//scenario 1

app.get("/todos/", async (request, response) => {
  const {
    id = "",
    todo = "",
    status = "",
    priority = "",
    search_q = "",
  } = request.query;

  if (status != "") {
    //scenario 1
    const queryline = `
  select * from todo where status LIKE '%${status}%';
  `;
    const res = await db.all(queryline);
    response.send(res);
  } else if (priority != "") {
    //scenario 2
    const queryline = `
  select * from todo where priority LIKE '%${priority}%';
  `;
    const res = await db.all(queryline);
    response.send(res);
  } else if (priority != "" && status != "") {
    //scenario 3
    const queryline = `
  select * from todo where priority LIKE '%${priority}%' and status LIKE '%${status}%';
  `;
    const res = await db.all(queryline);
    response.send(res);
  } else if (search_q != "") {
    //scenario 4
    const queryline = `
  select * from todo where todo LIKE '%${search_q}%';
  `;
    const res = await db.all(queryline);
    response.send(res);
  }
});

//api 2

app.get("/todos/:todoId/", async (a, b) => {
  const { todoId } = a.params;
  const query = `
    select * from todo where id = '${todoId}';
    `;
  const res = await db.get(query);
  b.send(res);
});

//api 3

app.post("/todos/", async (a, b) => {
  const { id, todo, priority, status } = a.body;
  const query = `
        insert into todo (id,todo,priority,status)
        values('${id}','${todo}','${priority}','${status}');
    `;
  const res = await db.run(query);
  b.send("Todo Successfully Added");
});

//api 4

app.put("/todos/:todoId/", async (a, b) => {
  const { todoId } = a.params;
  const { todo = "", status = "", priority = "" } = a.body;
  console.log(status);
  if (status != "") {
    const query = `
          update todo set status = '${status}' where id = '${todoId}';
          `;
    const res = db.run(query);
    b.send("Status Updated");
  } else if (priority != "") {
    const query = `
          update todo set priority = '${priority}' where id = '${todoId}';
          `;
    const res = db.run(query);
    b.send("Priority Updated");
  } else if (todo != "") {
    const query = `
          update todo set todo = '${todo}' where id = '${todoId}';
          `;
    const res = db.run(query);
    b.send("Todo Updated");
  }
});

//api 5

app.delete("/todos/:todoId/", async (a, b) => {
  const { todoId } = a.params;
  const query = `
        delete from todo where id = '${todoId}';
    `;
  const res = await db.run(query);
  b.send("Todo Deleted");
});

module.exports = app;
