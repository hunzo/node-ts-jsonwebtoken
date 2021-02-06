import ex, { Application, NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
require("dotenv").config()

const SECRET_KEY = process.env.SECRET_KEY || ""

const app: Application = ex()
const authUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token || ""
    if (token == null) return res.sendStatus(401)

    jwt.verify(token.toString(), SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json(err)

        console.log(user)

        req.user = (user as any).email
        next()
    })
}

app.get("/", (req: Request, res: Response) => {
    res.json({
        info: "test",
    })
})

app.get("/gentoken/:email", (req: Request, res: Response) => {
    res.json({
        token: jwt.sign({ email: req.params.email }, SECRET_KEY, {
            expiresIn: 30,
        }),
    })
})

app.get("/protect", authUser, (req: Request, res: Response) => {
    res.json({
        user: req.user,
    })
})

app.listen(process.env.PORT || 3000)
