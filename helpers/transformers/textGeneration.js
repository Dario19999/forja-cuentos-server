require('dotenv').config();
const { OpenAI } = require('openai');
const openAi = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});

class TaleGenerator {
    
    #fullTale = "";
    #synopsis = "";
    
    constructor() {
        this.generatorModel = "deepseek-chat";
    }
     
    #generateText = async (prompt) => {
        
        const completion = await openAi.chat.completions.create({
            model: this.generatorModel,
            messages: [
                {
                    role: 'system',
                    content: `Como escritor latinoamericano, genera un cuento literario en español latino con la siguiente estructura:
Debe carecer por completo y en cualquier aspecto de contenido sexual explícito, descripciones gráficas de violencia, lenguaje ofensivo o contenido que pueda ser considerado inapropiado para menores de edad.
La respuesta debe de ser únicamente el cuento literario, sin ningún tipo de contenido adicional.
No debe pasar de 1000 palabras.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 1.5,
            top_p: 0.9,
            response_format:{"type": "text"}
        });

        console.log(completion);

        return completion.choices[0].message.content
    };

    genTale = async (taleData) => {

        const characterList = taleData.characters.map(character=> {
            return `    - ${character.type}: Su nombre es ${character.name}. ${character.role}`;
        });
        
        let parsedGenre = '';
        switch (taleData.genre) {
            case 'aventura': parsedGenre = 'Aventura'; break;
            case 'c-f': parsedGenre = 'Ciencia ficción'; break;
            case 'fantasia': parsedGenre = 'Fantasía'; break;
            case 'misterio': parsedGenre = 'Misterio'; break;
            case 'terror': parsedGenre = 'Terror'; break;
        }

        const talePrompt = `
Redacta un cuento que tenga las siguientes características:
El título del cuento es: ${taleData.title}
El género del cuento es: ${parsedGenre}
El cuento tiene ${taleData.characters.length} personajes, los cuales son:
${characterList.join('\n')}
La narración del cuento tiene estilo de: ${taleData.narrator.style}
La introducción del cuento es: ${taleData.introduction}	
El desarrollo del cuento es: ${taleData.development}
La conclusión del cuento es: ${taleData.conclusion}`;

        this.#fullTale = await this.#generateText(talePrompt);
    } 

    genSynopsis = async () => {
    }

    get getFullTale() {
        return this.#fullTale;
    }

    get getSypnosis() {
        return this.#synopsis;
    }
}

module.exports = TaleGenerator;