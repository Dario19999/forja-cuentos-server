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
     
    #generateText = async (prompt, isSynopsis = false) => {
        
        const completion = await openAi.chat.completions.create({
            model: this.generatorModel,
            messages: [
                {
                    role: 'system',
                    content: `Como escritor latinoamericano, redacta escritos literarios en español latino con la descripcion brindada en el prompt.
Evita agregar el título del cuento en el cuerpo del texto.
El cuento debe ser original y no debe ser una copia de otro cuento.
Debe carecer por completo y en cualquier aspecto de contenido sexual explícito, descripciones gráficas de violencia, lenguaje ofensivo o contenido que pueda ser considerado inapropiado para menores de edad.
La respuesta debe de ser únicamente el cuento literario, sin ningún tipo de contenido adicional.
No debe pasar de 1000 palabras.`
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: isSynopsis ? 100 : 1000, // Ajusta el número de tokens para la sinopsis
            temperature: isSynopsis ? 0.7 : 0.8,  // Ajusta la temperatura para la sinopsis
            top_p: 0.9
        });

        return completion.choices[0].message.content
    };

    genTale = async (taleData) => {

        const characterList = taleData.parsedCharacters.map(character=> {
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
El cuento tiene ${taleData.parsedCharacters.length} personajes, los cuales son:
${characterList.join('\n')}
La narración del cuento tiene estilo de: ${taleData.narrator.style}
La introducción del cuento es: ${taleData.introduction}	
El desarrollo del cuento es: ${taleData.development}
La conclusión del cuento es: ${taleData.conclusion}`;

        this.#fullTale = await this.#generateText(talePrompt);
    } 

    genSynopsis = async () => {
        const synopsisPrompt = `
Eres un experto en resumir cuentos. Tu tarea es generar una sinopsis breve y concisa del siguiente cuento. La sinopsis debe:
- Tener un máximo de 100 palabras.
- Capturar la esencia del cuento, incluyendo los personajes principales, el conflicto y el desenlace.
- Evitar detalles innecesarios.
- Estar escrita en español latino.

Cuento:
${this.#fullTale}`;

        this.#synopsis = await this.#generateText(synopsisPrompt, true);
        
    }

    get getFullTale() {
        return this.#fullTale;
    }

    get getSypnosis() {
        return this.#synopsis;
    }
}

module.exports = TaleGenerator;