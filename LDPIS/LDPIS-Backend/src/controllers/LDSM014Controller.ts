import { Request, Response } from "express";
import moment from 'moment'
import LDSM014 from '../models/LDSM014Model';
import { Post } from "../typed/typed";


export const getQualityResultData = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            batch_id,
            frmDt,
            toDt
        } = req.body;

        const results: any = await LDSM014.prototype.getQualityResultData(
            plant,
            batch_id,
            frmDt,
            toDt
        );
        const table: any = [];
        const header: any = [];
        const columns: any = [];

        for (let i = 0; i < results.metaData.length; i++) {
            header.push((results.metaData[i].name as string).replace(/ /g, ''))
        }

        for (let i = 0; i < results.metaData.length; i++) {
            var obj: any = {};
            obj.title = (results.metaData[i].name as string);
            obj.field = header[i];
            columns.push(obj)
        }

        for (let i = 0; i < results.rows.length; i++) {
            const arr = results.rows[i];
            var jsonObj: any = {};
            header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
            table.push(jsonObj)
        }

        return res.status(200).json(table);


    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getStripChartData = async (req: Request, res: Response) => {
    try {
        if (req?.body?.type === 'R') {
            let total = [];
            let table: any = [];
            let tubeVar = [15.88, 17.25, 18.25, 19.05, 21.40, 21.70, 21.90, 22.23, 25.40, 28.58, 30.00, 31.75, 33.70, 34.00, 34.93, 38.10, 40.00, 41.28, 42.70, 44.45, 45.00, 48.60, 50.80, 54.00, 55.56, 57.15, 60.30, 63.50, 65.00, 69.85, 76.20, 81.20, 88.90, 93.26, 94.80, 101.60, 104.50, 106.00, 107.95, 114.30, 0];
            let widthVar = [[46, 50], [50, 54], [55, 57.5], [56, 60], [63, 66], [63.5, 67], [65, 68], [65, 70], [75.5, 80], [85, 89.5], [90, 94.5], [95, 99], [99, 106], [101.5, 106.5], [103.5, 108.5], [113.5, 121], [120, 125.5], [123.5, 130.5], [126.5, 130.5], [131, 140], [139, 140], [147.5, 154], [149, 160.5], [166.5, 170], [171, 177], [171, 180], [182.5, 189], [190, 201], [197.5, 203.5], [209, 218.5], [232, 239.5], [245, 255], [270, 279.5], [286, 296.5], [295.00, 295.00], [310, 320], [325.00, 325.00], [331.00, 331.00], [335, 337.5], [351, 358], [0, 100]];
            let thickVar = [[0.80, 2.60], [0.90, 2.60], [1.0, 2.0], [0.80, 2.6], [1.0, 2.30], [1.0, 2.8], [1.4, 2.6], [0.8, 3.0], [0.80, 3.25], [0.80, 3.5], [0.90, 94.5], [0.80, 3.5], [1.0, 3.5], [1.0, 4.0], [0.90, 4.0], [0.80, 4.5], [1.0, 3.25], [1.0, 4.5], [1.0, 4.0], [0.90, 5.5], [1.4, 2.3], [0.80, 4.5], [1.0, 6.5], [1.4, 3.25], [1.0, 4.0], [1.22, 5.5], [1.22, 4.0], [1.2, 6.5], [1.4, 4.0], [1.63, 6.5], [1.4, 5.5], [1.63, 5.5], [1.6, 6.0], [1.63, 5.0], [3.20, 3.20], [1.5, 5.0], [2.50, 2.50], [3.20, 3.20], [2.30, 3.0], [2.3, 4.5], [0, 100]];
            for (let x = 0; x < tubeVar?.length; x++) {
                let data = {
                    ...req.body,
                    tube: tubeVar[x],
                    width: widthVar[x],
                    thick: thickVar[x]
                }
                const results: any = await LDSM014.prototype.getStripChartData(
                    data
                );
                const header: any = [];

                for (let i = 0; i < results.metaData.length; i++) {
                    header.push((results.metaData[i].name as string).replace(/ /g, ''))
                }

                for (let i = 0; i < results.rows.length; i++) {
                    const arr = results.rows[i];
                    var jsonObj: any = {};
                    header.forEach((key: any, i: any) => jsonObj[key] = arr[i]);
                    jsonObj['tube'] = tubeVar[x];
                    jsonObj['width'] = widthVar[x]?.join();
                    jsonObj['thick'] = thickVar[x].join();
                    table.push(jsonObj)
                }
            }
            return res.status(200).json(table);
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
};

