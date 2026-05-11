import express, {json} from 'express';
import {movieRouter} from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

export const createApp = ({MovieModel}) =>{ 
const app = express();
const PORT =process.env.PORT ?? 3000;


app.use(corsMiddleware());
app.use(express.static('public'));
app.use(json());
app.use('/movies', movieRouter({MovieModel}));

    app.listen(PORT, ()=>{
     console.log(`Server listening on port ${PORT}`);
    })
}