import { Router } from "express";
import { tokenValidated } from "../middlewares/auth.js";
import FichaController from "../controllers/FichaController.js";
const router = Router();
router.use(tokenValidated);
router.get("/private", (req, res) => {
    const currentUser = JSON.parse(req.headers.user || {});
    return res.status(200).json({
        message: "Rota acessada com sucesso",
        data: {userLogged: currentUser}
    })
})


router.post("/ficha", FichaController.create)
router.get("/fichas", FichaController.findAll)
router.get("/ficha/:id", FichaController.findOne)
router.put("/ficha/:id", FichaController.update)
router.delete("/ficha/:id", FichaController.delete)




export default router;