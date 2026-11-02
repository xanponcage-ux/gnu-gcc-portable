import { Request, Response } from "express";
import moment from 'moment'
import CommonModel from '../models/CommonModel';
import { Post } from "../typed/typed";

export const getGroupPlant = async (req: Request, res: Response) => {
    try {
        let id = req.body.adid;
        const results: any = await CommonModel.prototype.getGroupPlant(id);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};