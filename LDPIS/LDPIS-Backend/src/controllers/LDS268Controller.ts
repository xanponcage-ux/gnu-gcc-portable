import { Request, Response } from "express";
import moment from 'moment'
import LDS268 from "../models/LDS268Model";
import { Post } from "../typed/typed";


export const updateDetails = async (req: Request, res: Response) => {
    try {
        if (req.body.page === 20) {
            const results: any = await LDS268.prototype.page20(req.body.data);
            return res.status(200).json(results);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
};


