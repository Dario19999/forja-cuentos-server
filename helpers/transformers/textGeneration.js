import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false; // Desactiva modelos locales
env.backends.onnx.wasm.numThreads = 1; // Optimiza el uso de recursos

class TaleGenerator {

    #generatorModel = "mistralai/Mistral-7B-Instruct-v0.2";

    constructor({
        introduction,
        development,
        conclusion,
        genre,
        characters,
        narratorType
    }) {
        this.generatorModel = this.#generatorModel;
        this.initializeGenerator();
    }

    async initializeGenerator() {
        console.log("Cargando el modelo.");
        this.generator = await pipeline("text-generation", this.#generatorModel);
    }
    
    #generateTale = async (prompt) => {

        const output = await generator(prompt, {
            max_new_tokens: 1000, // Cantidad aproximada de plantas a generar
            temperature: 0.7,     // Controla la creatividad
            top_k: 50,           // Reduce la aleatoriedad
            top_p: 0.9           // Controla la diversidad de la salida
        });
    
        return output[0].generated_text
    };
}

module.exports = TaleGenerator;