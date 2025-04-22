// Import
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Create an Express application
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoDbPath = "mongodb+srv://widechats:11223344@super-note.fizc5qz.mongodb.net/";
mongoose
  .connect(mongoDbPath)
  .then(function () {
    console.log("Connected to MongoDB");

    // Define route
    app.get("/", (req, res) => {
      const message = { message: "Api working" };
      res.json(message);
    });

    const noteRouter = require("./routes/Note");
    app.use("/notes", noteRouter);
  })

  .catch((e) => {
    console.log(`Connecting failed: ${e}`);
  });

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

/*

## 🧩 `params` (Route Parameters)

- **Where it's from:** The **URL path**
- **Use case:** When you want to pass identifiers directly in the URL
- **Accessed via:** `req.params`
- **Example route:**  
  ```js
  app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
  });
  ```
- **Example request URL:**  
  ```
  GET /user/123
  ```
- **Result:** `req.params.userId === '123'`

---

## 📦 `body` (Request Body)

- **Where it's from:** The **body of the HTTP request**
- **Use case:** When you want to send data like objects, arrays, or sensitive data (e.g., login credentials)
- **Accessed via:** `req.body`
- **Only works with:** `POST`, `PUT`, `PATCH` (not `GET`)
- **Requires middleware:**  
  You must use `express.json()` or `express.urlencoded()` for Express to parse the body.
- **Example route:**
  ```js
  app.post('/user', (req, res) => {
    const userId = req.body.userId;
  });
  ```
- **Example request body (JSON):**
  ```json
  {
    "userId": "123"
  }
  ```

---

## 🆚 Quick Comparison

| Feature          | `params`               | `body`                        |
|------------------|------------------------|-------------------------------|
| Source           | URL (path)             | Request payload               |
| HTTP Method      | Mostly `GET`           | `POST`, `PUT`, `PATCH`        |
| Data Format      | Strings from URL       | JSON, form data, etc.         |
| Middleware needed| ❌ No                  | ✅ Yes (`express.json()`)     |

---

### ⚡ Real-world Example:

If you’re building a notes app:

- `GET /notes/123` – Use `req.params.noteId` to fetch note 123
- `POST /notes` – Send note data in `req.body` like `{ title: "My Note", content: "..." }`

---

Let me know if you want a cheat sheet or code examples with both in action!

*/
