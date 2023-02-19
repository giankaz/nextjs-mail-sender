import { MailDto } from "root/interfaces/MailDto";
import { z as zod } from "zod";

export const mailSchema: zod.ZodType<MailDto> = zod.object({
  user_name: zod
    .string()
    .min(1, "Nome é obrigatório")
    .max(30, "Nome não pode ter mais que 30 caracteres"),
  user_mail: zod
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(50, "Email não pode ter mais que 50 caracteres"),
  subject: zod
    .string()
    .min(1, "Assunto é obrigatório")
    .max(30, "Assunto não pode ter mais que 30 caracteres"),
  content: zod
    .string()
    .min(1, "Texto é obrigatório")
    .max(200, "Texto não pode ter mais que 200 caracteres"),
});

export type MailData = zod.infer<typeof mailSchema>;
