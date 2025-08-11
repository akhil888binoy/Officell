import express from 'express';
import { createCompany, deleteCompany, getAllCompanies, getCompany, updateCompany } from '../controllers/company.controller';

export const companyRouter = express.Router();

companyRouter.get("/companies", getAllCompanies);
companyRouter.get("/companies/:id", getCompany);
companyRouter.post("/companies", createCompany);
companyRouter.put("/companies/:id", updateCompany);
companyRouter.delete("/companies/:id", deleteCompany);
