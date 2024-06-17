import { object, string, z } from 'zod';

export type Identified = z.infer<typeof Identified>;

export const Identified = object({
    id: string()
});
