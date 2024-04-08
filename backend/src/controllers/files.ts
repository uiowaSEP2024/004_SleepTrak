import type { Response } from 'express';
import { service } from '../services/files.js';
import { ensureError } from '../utils/error.js';
import AWS from 'aws-sdk';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const create = async (
  req: {
    file: { originalname: any; buffer: any };
    body: any;
    parameters: { babyId: any };
  },
  res: Response
): Promise<void> => {
  try {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME ?? 'NO_BUCKET_NAME_IN_ENV',
      Key: req.file.originalname,
      Body: req.file.buffer
    };
    const data = await s3.upload(params).promise();

    const fileData = {
      filename: data.Key,
      url: data.Location,
      baby: { connect: { babyId: req.body.babyId } }
    };

    const file = await service.create(fileData);
    res.json(file);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};

export const controller = {
  create
};
