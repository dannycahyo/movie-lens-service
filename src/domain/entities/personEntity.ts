import { z } from "zod";

const PersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  birthday: z.date().nullable(),
  deathday: z.date().nullable(),
  gender: z.number().nullable(),
});

const PersonWithRevenueSchema = PersonSchema.extend({
  total_revenue: z.string(),
});

type Person = z.infer<typeof PersonSchema>;
type PersonWithRevenue = z.infer<typeof PersonWithRevenueSchema>;

export { PersonSchema, type Person, type PersonWithRevenue };
