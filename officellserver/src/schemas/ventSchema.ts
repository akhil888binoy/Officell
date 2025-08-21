import {z} from 'zod';

export const createVentSchema = z.object({
    company_id : z.int(),
    no_pii : z.boolean(),
    verified_employee : z.boolean(), 
    content : z.string(),
    category : z.string(),
    media_url: z.string(),
    media_type: z.string()
});


export const reportVentSchema = z.object({
    report : z.string(),
    category : z.string()
});


export const addCommentSchema = z.object({
    comment: z.string()
});

export const updateVentSchema = z.object({
    company_id : z.int().optional(),
    no_pii : z.boolean().optional(),
    content : z.string().optional(),
    category : z.string().optional(),
});
