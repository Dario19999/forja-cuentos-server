require('dotenv').config();
const { OpenAI } = require('openai');
const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateNarration = async (textSegment, voiceType) => {
    let modelVoice = '';

    if(voiceType === 'female'){
        modelVoice = 'alloy';
    }
    else {
        modelVoice = 'onyx';
    }

    try {
        const mp3 = await openAi.audio.speech.create({
            model: 'tts-1',
            input: textSegment,
            voice: modelVoice,
            response_format: 'mp3',
        });
  
        const audioBuffer = Buffer.from(await mp3.arrayBuffer());
        return audioBuffer;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = generateNarration;