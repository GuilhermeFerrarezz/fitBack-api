import { Router } from "express";
import { tokenValidated } from "../middlewares/auth.js";
import ExercicioController from "../controllers/ExercicioController.js";
const router = Router();
router.use(tokenValidated);
router.get("/private", (req, res) => {
    const currentUser = JSON.parse(req.headers.user || {});
    return res.status(200).json({
        message: "Rota acessada com sucesso",
        data: {userLogged: currentUser}
    })
})

router.post("/exercicio/:fichaId", ExercicioController.create)
router.get("/exercicios/:fichaId", ExercicioController.findAll)
router.get("/exercicio/:id/:fichaId", ExercicioController.findOne)
router.put("/exercicio/:id/:fichaId", ExercicioController.update)
router.delete("/exercicio/:id/:fichaId", ExercicioController.delete)




export default router;