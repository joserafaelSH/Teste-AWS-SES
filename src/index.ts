import 'dotenv/config';
import express from 'express';
import routes from './routes/routes';

const app = express();

app.use(express.json());
app.get('/', (request, response) => { return response.json({message: 'Hello World'}) });
app.use(routes);
app.listen(3000, () => {
    console.log('Server started on port 3000!');
});