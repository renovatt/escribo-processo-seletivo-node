import { z } from 'zod'

const cellphoneSchema = z.object({
  ddd: z
    .string()
    .min(2, 'Campo obrigatório')
    .max(2, 'Máximo de 2 caracteres')
    .refine((value) => !/\s/.test(value), {
      message: 'Campo não pode conter espaços em branco.',
    }),
  number: z
    .string()
    .min(9, 'Campo obrigatório')
    .max(9, 'Máximo de 9 caracteres')
    .refine((value) => !/\s/.test(value), {
      message: 'Campo não pode conter espaços em branco.',
    }),
})

export const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(5, 'Campo obrigatório')
    .refine((value) => value.trim() === value, {
      message: 'Não é permitido espaço em branco no início ou no final.',
    }),
  email: z
    .string()
    .email('Precisa ser um email válido')
    .min(1, 'Campo obrigatório'),
  password: z.string().min(8, 'Precisa ter pelo menos 8 caracteres'),
  cellphones: z.array(cellphoneSchema),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  last_login: z.date().optional(),
})

export const loginSchema = z.object({
  email: z
    .string()
    .email('Precisa ser um email valido')
    .min(1, 'Campo obrigatório'),
  password: z.string().min(8, 'Precisa ter pelo menos 8 caracteres'),
})

export type UserSchemaProps = z.infer<typeof userSchema>
export type loginSchemaProps = z.infer<typeof loginSchema>
