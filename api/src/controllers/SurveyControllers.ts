import { getCustomRepository } from "typeorm";
import { Request, Response } from "express";
import { SurveyRepository } from "../repositories/SurveyRepository";

class SurveyControllers {
  async create(req: Request, res: Response) {
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveyRepository);
    const survey = surveyRepository.create({
      title,
      description,
    });

    await surveyRepository.save(survey);
    res.status(201).json(survey);
  }

  async show(req: Request, res: Response) {
    const surveyRepository = getCustomRepository(SurveyRepository);
    const all = await surveyRepository.find();
    res.status(200).json(all);
  }
}

export { SurveyControllers };
