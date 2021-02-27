import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: "Validation Faield" });
    // }

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (error) {
      throw new AppError(error);
    }

    const userRepository = getCustomRepository(UserRepository);
    const user = userRepository.create({
      name,
      email,
    });

    const userAlreadyExists = await userRepository.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ error: "User Already Exists" });
    }

    await userRepository.save(user);
    return res.status(201).json(user);
  }

  async show(req: Request, res: Response) {
    const userRepository = getCustomRepository(UserRepository);
    const all = await userRepository.find();
    res.status(200).json(all);
  }
}

export { UserController };
