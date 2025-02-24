const { pipeline, env } = require("@xenova/transformers");
require('dotenv').config();

env.allowLocalModels = false; // Desactiva modelos locales
env.backends.onnx.wasm.numThreads = 1; // Optimiza el uso de recursos

class TaleGenerator {
    
    #fullTale = "";
    #synopsis = "";
    
    constructor() {
        this.generatorModel = "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B";
        this.initializeGenerator();
    }

    async initializeGenerator() {
        console.log("Cargando el modelo.");
        this.generator = await pipeline("text-generation", this.generatorModel, {
            use_auth_token: process.env.HF_TOKEN,
        });
    }
    
    #generateText = async (prompt) => {

        const output = await generator(prompt, {
            max_new_tokens: 1000, // Cantidad aproximada de plantas a generar
            temperature: 0.7,     // Controla la creatividad
            top_k: 50,           // Reduce la aleatoriedad
            top_p: 0.9           // Controla la diversidad de la salida
        });

        return output[0].generated_text
    };

    genTale = async (taleData) => {

        const characterList = taleData.characters.map(character=> {
            return `    - ${character.type}: ${character.name}. ${character.role}`;
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
            Como escritor latinoamericano, genera un cuento literario con la siguiente estructura:
            Debe carecer por completo y en cualquier aspecto de contenido sexual explícito, descripciones gráficas de violencia, lenguaje ofensivo o contenido que pueda ser considerado inapropiado para menores de edad.
            La respuesta debe de ser únicamente el cuento literario, sin ningún tipo de contenido adicional.
            El género del cuento es: ${parsedGenre}
            El cuento tiene ${taleData.characters.length} personajes, los cuales son:
            ${characterList.join('\n')}
            La narración del cuento tiene estilo de: ${taleData.narrator}
            La introducción del cuento es: ${taleData.introduction}	
            El desarrollo del cuento es: ${taleData.development}
            La conclusión del cuento es: ${taleData.conclusion}
        `
        console.log(talePrompt);
        // const tale = await this.#generateText(talePrompt);
        // return tale;
    }

    genSynopsis = async () => {
    }
}

module.exports = TaleGenerator;