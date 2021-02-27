import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { AppError } from "../errors/AppError";

class AnswerController {
  // http://localhost:3333/answers/6?u=28e09304-9764-433e-aa42-79a567623294
  /*
        - Route Params => Parâmetros que compoem as rotas. routes.get("/answers/:value").
        
        - Query Params => Parâmetros para Busca, Paginação e não obrigatórios. 
        identificados com início: ?chave=valor.

    */

  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { u } = req.query;

    const SurveysUsersRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await SurveysUsersRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) throw new AppError("Survey does not exists!");
    // return res.status(400).json({ error: "Survey does not exists!" });

    surveyUser.value = Number(value);

    await SurveysUsersRepository.save(surveyUser);
    return res.json(surveyUser);
  }
}

export { AnswerController };
