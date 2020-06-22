import express from 'express';
import { readFile, readdir } from 'fs/promises';
import MD from 'markdown-it';

const PORT = process.env.PORT || 3000
const app = express();
const md = MD();

const Types = {
    base: 'base_layers',
    condiments: 'condiments',
    full: 'full_tacos',
    like: 'like_tacos',
    mixins: 'mixins',
    seasonings: 'seasonings',
    shells: 'shells'
}

const convertName = name => name.replace(/_/gi, ' ');
const trimName = name => name.replace(/\.md/gi, '');

const isLayer = name => Object.values(Types).findIndex( layer => layer === name) > -1;

app.get(`/:layer/:recipe`, async (req, res) => {
    const {layer, recipe} = req.params;
    if(isLayer(layer)){
        try{
            const file = await readFile(`./${layer}/${recipe}.md`, 'utf-8');
            res.send(md.render(file));
        } catch(err){
            res.sendStatus(404);
        }
    }
    else {
        res.sendStatus(404);
    }
});

app.get('/favicon.ico', (req, res) => {
    res.sendStatus(404);
})

app.get(`/:layer`, async (req, res) => {
    const {layer} = req.params;
    if(isLayer(layer)){
        try{
            const files = await readdir(`./${layer}`);
            const trimed = files.filter(item => item !== 'README.md');
            res.send(
                trimed.map(file => {
                    return ({slug: trimName(file), name: trimName(convertName(file)) })
                })
            );
        } catch(err){
            res.sendStatus(404);    
        }
    }
    else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => console.log(`Get ready for some taco goodness http://localhost:${PORT}`));