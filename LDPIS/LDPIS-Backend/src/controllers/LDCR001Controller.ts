import { Request, Response } from "express";
import moment from 'moment'
import LDCR001 from '../models/LDCR001Model';
import { Post } from "../typed/typed";
import oracledb from "oracledb";

export const getinspectorlist = async (req: Request, res: Response) => {
    try {
      let process = req.body.process;
      const results: any = await LDCR001.prototype.getinspectorlist(process);
    //   return res.status(200).json(await ResponceData(results));
      return res.status(200).json(results.rows);
    } catch (error) {
      return res.status(400).json(error);
    }
  };


export const getimpactdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getimpactdata(
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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
export const getautomaticweld = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            inspector,
            heatno,
            pipeno, // This will now be an array of strings
            mutverification,
            // rmno,
            result
        } = req.body;
        console.log(req.body.pipeno); // This will log the array
  
        const results: any = await LDCR001.prototype.getautomaticweld(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            inspector,
            heatno,
            pipeno, // Pass the array directly
            mutverification,
            result
            // rmno
        )
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


// export const getautomaticweld = async (req: Request, res: Response) => {
//     try {
//         var {
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno

//         } = req.body;

//         const results: any = await LDCR001.prototype.getautomaticweld(
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno
//         )
//         const table: any = [];
//         const header: any = [];
//         const columns: any = [];

//         for (let i = 0; i < results.metaData.length; i++) {
//             header.push((results.metaData[i].name as string).replace(/ /g, ''))
//         }

//         for (let i = 0; i < results.metaData.length; i++) {
//             var obj: any = {};
//             obj.title = (results.metaData[i].name as string);
//             obj.field = header[i];
//             columns.push(obj)
//         }

//         for (let i = 0; i < results.rows.length; i++) {
//             const arr = results.rows[i];
//             var jsonObj: any = {};
//             header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
//             table.push(jsonObj)
//         }

//         return res.status(200).json(table);


//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const getautomaticweldbody = async (req: Request, res: Response) => {
//     try {
//         var {
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno

//         } = req.body;

//         const results: any = await LDCR001.prototype.getautomaticweldbody(
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno
//         )
//         const table: any = [];
//         const header: any = [];
//         const columns: any = [];

//         for (let i = 0; i < results.metaData.length; i++) {
//             header.push((results.metaData[i].name as string).replace(/ /g, ''))
//         }

//         for (let i = 0; i < results.metaData.length; i++) {
//             var obj: any = {};
//             obj.title = (results.metaData[i].name as string);
//             obj.field = header[i];
//             columns.push(obj)
//         }

//         for (let i = 0; i < results.rows.length; i++) {
//             const arr = results.rows[i];
//             var jsonObj: any = {};
//             header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
//             table.push(jsonObj)
//         }

//         return res.status(200).json(table);


//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

export const getautomaticweldbody = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            inspector,
            heatno,
            pipeno, // This will now be an array of strings
            mutverification,
            // rmno
        } = req.body;
        console.log(req.body.pipeno); // This will log the array
  
        const results: any = await LDCR001.prototype.getautomaticweldbody(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            inspector,
            heatno,
            pipeno, // Pass the array directly
            mutverification,
            // rmno
        )
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

export const getchemdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getchemdata(
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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


export const getVdidata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getVdidata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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

export const gethardnessdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.gethardnessdata(
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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

export const getFRBTdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getFRBTdata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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

export const getVdirdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno, // This will now be an array of strings
            // rmno
        } = req.body;
        console.log(req.body.pipeno); // This will log the array
  
        const results: any = await LDCR001.prototype.getVdirdata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno, // Pass the array directly
            // rmno
        )
        console.log('R ----->  results',results)
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

// export const getVdirdata = async (req: Request, res: Response) => {
//     try {
//         var {
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno

//         } = req.body;

//         const results: any = await LDCR001.prototype.getVdirdata(
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno
//         )
//         const table: any = [];
//         const header: any = [];
//         const columns: any = [];

//         for (let i = 0; i < results.metaData.length; i++) {
//             header.push((results.metaData[i].name as string).replace(/ /g, ''))
//         }

//         for (let i = 0; i < results.metaData.length; i++) {
//             var obj: any = {};
//             obj.title = (results.metaData[i].name as string);
//             obj.field = header[i];
//             columns.push(obj)
//         }

//         for (let i = 0; i < results.rows.length; i++) {
//             const arr = results.rows[i];
//             var jsonObj: any = {};
//             header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
//             table.push(jsonObj)
//         }

//         return res.status(200).json(table);


//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const getVdirSdata = async (req: Request, res: Response) => {
//     try {
//         var {
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno

//         } = req.body;

//         const results: any = await LDCR001.prototype.getVdirSdata(
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno
//         )
//         const table: any = [];
//         const header: any = [];
//         const columns: any = [];

//         for (let i = 0; i < results.metaData.length; i++) {
//             header.push((results.metaData[i].name as string).replace(/ /g, ''))
//         }

//         for (let i = 0; i < results.metaData.length; i++) {
//             var obj: any = {};
//             obj.title = (results.metaData[i].name as string);
//             obj.field = header[i];
//             columns.push(obj)
//         }

//         for (let i = 0; i < results.rows.length; i++) {
//             const arr = results.rows[i];
//             var jsonObj: any = {};
//             header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
//             table.push(jsonObj)
//         }

//         return res.status(200).json(table);


//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

export const getVdirSdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno, // This will now be an array of strings
            // rmno
        } = req.body;
        console.log(req.body.pipeno); // This will log the array
  
        const results: any = await LDCR001.prototype.getVdirSdata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno, // Pass the array directly
            // rmno
        )
        console.log('S ----->  results',results)
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

export const getMRRdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno,
            slitNo

        } = req.body;

        const results: any = await LDCR001.prototype.getMRRdata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno,
            slitNo
        )
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

export const getMRRSdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getMRRSdata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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

export const getDROPdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getDROPdata(
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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

export const getmechanicaldata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getmechanicaldata(
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        console.log('Controller MECH');

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

export const getmechanicaldataWTWT = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getmechanicaldataWTWT(
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
        const table: any = [];
        const header: any = [];
        const columns: any = [];
        console.log('Controller MECH');

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



export const getMGERdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno

        } = req.body;

        const results: any = await LDCR001.prototype.getMGERdata(
            plant,
            orderNo,
            item,
            matno,
            crdate,
            heatno,
            pipeno,
            // rmno
        )
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

export const getMGNdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            inspector,
            crdate,
            heatno,
            pipeno, // This will now be an array of strings
            // rmno
        } = req.body;
        console.log(req.body.pipeno); // This will log the array
  
        const results: any = await LDCR001.prototype.getMGNdata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            inspector,
            crdate,
            heatno,
            pipeno, // Pass the array directly
            // rmno
        )
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

// export const getMGNdata = async (req: Request, res: Response) => {
//     try {
//         var {
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno

//         } = req.body;

//         const results: any = await LDCR001.prototype.getMGNdata(
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno
//         )
//         const table: any = [];
//         const header: any = [];
//         const columns: any = [];

//         for (let i = 0; i < results.metaData.length; i++) {
//             header.push((results.metaData[i].name as string).replace(/ /g, ''))
//         }

//         for (let i = 0; i < results.metaData.length; i++) {
//             var obj: any = {};
//             obj.title = (results.metaData[i].name as string);
//             obj.field = header[i];
//             columns.push(obj)
//         }

//         for (let i = 0; i < results.rows.length; i++) {
//             const arr = results.rows[i];
//             var jsonObj: any = {};
//             header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
//             table.push(jsonObj)
//         }

//         return res.status(200).json(table);


//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// export const getHYSdata = async (req: Request, res: Response) => {
//     try {
//         var {
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno

//         } = req.body;
//         console.log(req.body.pipeno);

//         const results: any = await LDCR001.prototype.getHYSdata(
//             plant,
//             orderNo,
//             item,
//             matno,
//             crdate,
//             heatno,
//             pipeno,
//             // rmno
//         )
//         const table: any = [];
//         const header: any = [];
//         const columns: any = [];

//         for (let i = 0; i < results.metaData.length; i++) {
//             header.push((results.metaData[i].name as string).replace(/ /g, ''))
//         }

//         for (let i = 0; i < results.metaData.length; i++) {
//             var obj: any = {};
//             obj.title = (results.metaData[i].name as string);
//             obj.field = header[i];
//             columns.push(obj)
//         }

//         for (let i = 0; i < results.rows.length; i++) {
//             const arr = results.rows[i];
//             var jsonObj: any = {};
//             header.forEach((key: any, i: any) => jsonObj[key] = arr[i])
//             table.push(jsonObj)
//         }

//         return res.status(200).json(table);


//     } catch (error) {
//         return res.status(400).json(error);
//     }
// };

// Controller - No changes needed
export const getHYSdata = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno, // This will now be an array of strings
            // rmno
        } = req.body;
        console.log(req.body.pipeno); // This will log the array
  
        const results: any = await LDCR001.prototype.getHYSdata(
            plant,
            orderNo,
            item,
            matno,
            shift,
            crdate,
            heatno,
            pipeno, // Pass the array directly
            // rmno
        )
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


export const GetreportTyp = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        console.log('Controller',plant);
        const results: any = await LDCR001.prototype.GetreportTyp(plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPipenomill = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        console.log('Controller',plant);
        const results: any = await LDCR001.prototype.GetPipenomill(plant);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetSlitnomill = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let crdate = req.body.crdate;
        let item = req.body.item;
        let orderNo = req.body.orderNo;
        let rm = req.body.rm;
        let roundsectionmill = req.body.roundsectionmill;
        console.log('Controller',plant);
        const results: any = await LDCR001.prototype.GetSlitnomill(plant,crdate,item,orderNo,roundsectionmill, rm);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPipenomillround = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let crdate = req.body.crdate;
        let item = req.body.item;
        let orderNo = req.body.orderNo;
        let roundsectionmill = req.body.roundsectionmill;
        console.log('Controller',plant);
        const results: any = await LDCR001.prototype.GetPipenomillround(plant,crdate,item,orderNo,roundsectionmill);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const GetPipenomulti = async (req: Request, res: Response) => {
    try {
        let plant = req.body.plant;
        let crdate = req.body.crdate;
        let item = req.body.item;
        let orderNo = req.body.orderNo;
        let roundsectionmill = req.body.roundsectionmill;
        console.log('Controller',plant);
        const results: any = await LDCR001.prototype.GetPipenomulti(plant,crdate,item,orderNo,roundsectionmill);
        return res.status(200).json(results.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getMergedInv = async (req: Request, res: Response) => {
    try {
        var {
            fromDt,
            mergedType,
            plant,
            toDt,
            batchMerg,
            mergedBatchMerg
        } = req.body;

        const results: any = await LDCR001.prototype.getMergedInv(
            fromDt,
            mergedType,
            plant,
            toDt,
            batchMerg,
            mergedBatchMerg
        )
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
        //  fullData.push(columns);
        //  fullData.push(table);

        return res.status(200).json(table);


    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOdiaFrm = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDCR001.prototype.getOdiaFrm(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getOdiaTo = async (req: Request, res: Response) => {
    try {

        var plant = req.body.plant;

        const results: any = await LDCR001.prototype.getOdiaTo(plant);
        const list: any = [];
        //create json
        results.rows.map(function (x: any) {
            list.push(x[0]);
        });

        //response
        return res.status(200).json(list);

    } catch (error) {
        return res.status(400).json(error);
    }
};

export const getReversedBatchInfo = async (req: Request, res: Response) => {
    try {
        var {
            plant,
            batchId,
            mergeBatch
        } = req.body;
    
        const results: any = await LDCR001.prototype.getReversedBatchInfo(
            plant,
            batchId,
            mergeBatch
        )
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


// CHanges for production movement