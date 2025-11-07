const db = require("./db")
const express = require("express")

const app = express()

app.use(express.json())

app.get("/", (_, res) => {
    res.send("Hello world")
})

app.post("/", (req, res) => {
    console.log(req.body)
    res.send("Успех")
})

app.get("/users", (_, res) => {
    const data = db.prepare("SELECT * FROM users").all()
    res.json(data)
})

app.post("/users", (req, res) => {
    const { email, name } = req.body

    try {
        if (!email || !name) {
            return res.status(400).json({ error: "Не хватает данных" })
        }
        const query = db.prepare(
            `INSERT INTO users (email, name) VALUES (?, ?)`
        )
        const info = query.run(email, name)
        const newUser = db
            .prepare(`SELECT * FROM users WHERE ID = ?`)
            .get(info.lastInsertRowid)
        res.status(201).json(newUser)
    } catch (error) {}
})

app.delete("/users/:id", (req, res) => {
    const { id } = req.params
    const query = db.prepare(`DELETE FROM users WHERE id = ?`)
    const result = query.run(id)

    if (result.changes === 0) res.status(404).json({error: "Пользователь не был найден"})

    res.status(200).json({message: "Юзер успешно удален"})
})

app.listen("3000", () => {
    console.log("Сервер запущен на порту 3000")
})
