import express from 'express';
import { createCompany, getAllCompanies, getCompany } from '../controllers/company.controller';
import { auth } from '../middleware/auth';

export const companyRouter = express.Router();

companyRouter.get("/companies", auth , getAllCompanies);
companyRouter.get("/companies/:id", auth , getCompany);
companyRouter.post("/companies", auth , createCompany);
