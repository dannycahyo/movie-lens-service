import { z } from "zod";

const PersonDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  birthday: z.date().nullable(),
  deathday: z.date().nullable(),
  gender: z.number().nullable(),
});

const PersonWithRevenueDTOSchema = PersonDTOSchema.extend({
  totalRevenue: z.string(),
});

type PersonDTO = z.infer<typeof PersonDTOSchema>;
type PersonWithRevenueDTO = z.infer<typeof PersonWithRevenueDTOSchema>;

export { PersonDTOSchema, PersonWithRevenueDTOSchema };

export type { PersonDTO, PersonWithRevenueDTO };
