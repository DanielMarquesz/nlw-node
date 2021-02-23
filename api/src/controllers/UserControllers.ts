import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/User";

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const userRepository = getRepository(User);
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
}

export { UserController };
