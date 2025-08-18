
import {z} from 'zod';

export const createCompanySchema = z.object({
        google_place_id : z.string().max(27).min(27).optional(), 
        name : z.string(), 
        domain : z.string().max(15).optional(), 
        industry : z.string().max(15).optional(),
        branch_name : z.string().max(20).optional(), 
        formatted_address : z.string().min(5).optional() , 
        city : z.string().optional(), 
        state: z.string().optional(),
        country : z.string().optional(),
        lat : z.float32().optional(), 
        lng : z.float32().optional(),
});