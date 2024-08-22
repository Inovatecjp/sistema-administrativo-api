import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";

import User from "../model/User";
import Profile from "../model/Profile";
import { Repository } from "typeorm";
import AppDataSource from "../../../database/dbConnection";
import CpfValidator from "../utils/CpfValidator";

import { sendMailPromise } from "../../mail/mailer";
import helper from "../../mail/helpers/mailHelper";
//

class UserController {
  async store(req: Request, res: Response): Promise<Response> {
    let { cpf, name, email, profile, password, phone } = req.body;

    let errors: String[] = [];

    const profileRepository: Repository<Profile> =
      AppDataSource.getRepository(Profile);

    const userRepository: Repository<User> = AppDataSource.getRepository(User);

    try {
      let user: User = await userRepository.findOne({
        where: { cpf: cpf },
      });

      if (user) {
        return res.status(400).json({
          errors: `Um usuário com o CPF: ${cpf} já está registrado. Verifique se o usuário está correto.`,
        });
      }

      if (!CpfValidator.validate(cpf)) {
        errors.push("O CPF inserido é inválido.");
      }

      if (!name) {
        errors.push("Um nome é obrigatório.");
      }

      if (!email) {
        errors.push("Um e-mail é obrigatório.");
      }

      if (!password) {
        errors.push("Uma senha é obrigatória.");
      }

      if (profile) {
        try {
          profile = await profileRepository.findOne({
            where: { name: profile },
          });
        } catch (error: any) {
          errors.push("O perfil inserido é inválido.");
        }
      }

      if (!profile) {
        profile = await profileRepository.findOne({
          where: { name: "default_user" },
        });

        if (!profile) {
          profile = profileRepository.create({
            name: "default_user",
            description: "Permissão de usuário padrão do sistema.",
            isAdmin: false,
          });
          await profileRepository.save(profile);
        }
      }

      if (!phone) {
        errors.push("Um número de telefone é obrigatório.");
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      user = userRepository.create({
        cpf,
        name,
        email,
        profile,
        phone,
        isAtivo: true,
      });

      user.password = password;

      await userRepository.save(user);

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_id: user.profile.id,
        },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: process.env.TOKEN_EXPIRATION,
        }
      );

      return res.json({
        token,
        user: { name: user.name, email: user.email },
      });
    } catch (err: any) {
      if (err.name === "QueryFailedError" && err.code === "23505") {
        const errorMessages = (err.detail || "Erro de unicidade").split("\n");
        return res.status(400).json({ errors: errorMessages });
      }

      console.error(err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async RecoveryPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email = "" } = req.body;
      let errors: String[] = [];
      let emailData = helper.createDefaultEmailConfig(email);

      if (!email) {
        errors.push("Um e-mail é obrigatório.");
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      try {
        const userRepository: Repository<User> =
          AppDataSource.getRepository(User);
        const user: User = await userRepository.findOneBy({ email: email });

        if (!user) {
          return res.status(404).json({
            errors: ["Email não registrado."],
          });
        }

        let domain = email.substring(email.indexOf("@"));
        let newPassword = domain + "1234";

        emailData.variables.user = user;
        emailData.variables.userName = user.cpf;
        emailData.variables.password = newPassword;

        user.password = newPassword;
        userRepository.update(user);

        sendMailPromise(
          emailData.email,
          emailData.subject,
          emailData.message,
          emailData.template,
          emailData.variables
        );
      } catch (error: any) {
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    } catch (error: any) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new UserController();