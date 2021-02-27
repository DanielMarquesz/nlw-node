import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UserRepository);
    const surveysRepository = getCustomRepository(SurveyRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (!userAlreadyExists) {
      return res.status(400).json({ error: "User does not exists!" });
    }

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!surveyAlreadyExists) {
      return res.status(400).json({ error: "Survey does not exists!" });
    }

    // Salvar informações na tabela SurveyUser
    const surveyUser = surveyUserRepository.create({
      user_id: userAlreadyExists.id,
      survey_id,
    });

    await surveyUserRepository.save(surveyUser);
    // Envia o Email para o usuário

    return res.json(surveyUser);
  }
}

export { SendMailController };
