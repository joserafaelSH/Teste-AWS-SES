import { Router } from "express";
import SendEmailTest from "../services/SendEmailTest";
import ParamsFile from "../templates/ParamsFile.json";


const routes = Router();

routes.post('/messages', async (request, response) => {
    await SendEmailTest.init();
    await SendEmailTest.sendMail(ParamsFile);
    return response.json({message: 'ok'}) 
    
});

export default routes;
