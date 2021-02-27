import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { resolve } from "path";
import { UserRepository } from "../repositories/UserRepository";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UserRepository);
    const surveysRepository = getCustomRepository(SurveyRepository);
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (!userAlreadyExists) throw new AppError("User does not exists!");

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!surveyAlreadyExists) throw new AppError("Survey does not exists!");

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUSerAlreadyExists = await surveyUserRepository.findOne({
      where: { user_id: userAlreadyExists.id, value: null },
      relations: ["user", "survey"],
    });

    const variables = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      id: "",
      user_id: userAlreadyExists.id,
      link: process.env.URL_MAIL,
    };

    if (surveyUSerAlreadyExists) {
      variables.id = surveyUSerAlreadyExists.id;
      await SendMailService.execute(
        email,
        surveyAlreadyExists.title,
        variables,
        npsPath
      );

      return res.json(surveyUSerAlreadyExists);
    }

    // Salvar informações na tabela SurveyUser
    const surveyUser = surveyUserRepository.create({
      user_id: userAlreadyExists.id,
      survey_id,
    });

    await surveyUserRepository.save(surveyUser);
    // Envia o Email para o usuário
    variables.id = surveyUser.id;
    await SendMailService.execute(
      email,
      surveyAlreadyExists.title,
      variables,
      npsPath
    );

    return res.json(surveyUser);
  }
}

export { SendMailController };
