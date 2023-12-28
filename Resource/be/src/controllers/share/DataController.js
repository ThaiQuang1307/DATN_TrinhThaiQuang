import BaseController from '../BaseController';
import { json2csv } from 'json-2-csv';
import fs from 'fs';
import { join } from 'path';
class DataController extends BaseController {

    constructor() {
        super();
        this.pathDir = join(process.cwd(), '/files');
    }

    // Create
    async asyncCreateFakeData(req, res, next) {
        const TITLE = '[Create fake data]';
        console.log(TITLE, 'start...');
        let result, pathFile;
        try {
            const { numbers = 100 } = req.body;

            const data =  Array.from({ length: numbers }, (v, i) => {
                const courseId = i < numbers / 2 ? 1 : 2;
                const studentId = i + 1;
                const STG = Math.random().toFixed(2);
                const SCG = Math.random().toFixed(2);
                const STR = Math.random().toFixed(2);
                const LPR = Math.random().toFixed(2);
                const PEG = Math.random().toFixed(2);
                return {
                    courseId, studentId, STG, SCG, STR, LPR, PEG
                }
            })

            const dataCSV =  await json2csv(data);

            const fileName = `fake-data_${Date.now()}.csv`;
            pathFile = `${this.pathDir}/${fileName}`;
            // save file csv to files folder
            fs.writeFileSync(pathFile, '\ufeff' + dataCSV, { encoding: 'utf8' });

        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result, pathFile);
            console.log(TITLE, 'end...');
        }
    }

}

export default DataController;