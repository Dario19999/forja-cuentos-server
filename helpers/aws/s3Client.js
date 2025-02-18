const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_S3_USER_KEY_ID,
    secretAccessKey: process.env.AWS_S3_USER_SECRET,
    region: process.env.AWS_S3_REGION
});

const S3 = new AWS.S3();

class S3Client {

    constructor() {
        this.S3 = S3;
    }

    async uploadFile(file, userId, taleName) {
        const key = `tales/${userId}/${taleName}/${file.originalname}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer
        };

        try {
            const S3Response = await this.S3.upload(params).promise();
            
            if (S3Response) {
                return {
                    S3Response, 
                    key
                }
            }
        } catch (error) {
            return error;
        }
    }
}

module.exports = S3Client;

