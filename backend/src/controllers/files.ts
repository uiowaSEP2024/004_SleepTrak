import type { Request, Response } from 'express';
import { service } from '../services/files.js';
import { ensureError } from '../utils/error.js';
import AWS from 'aws-sdk';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = await service.get(id);
    res.json(file);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};

const create = async (
  req: {
    file: { originalname: any; buffer: any };
    body: any;
    parameters: { babyId: any };
  },
  res: Response
): Promise<void> => {
  try {
    // Upload to S3
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME ?? 'NO_BUCKET_NAME_IN_ENV',
      Key: req.file.originalname,
      Body: req.file.buffer
    };
    const data = await s3.upload(params).promise();

    // Generate prisma db
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

const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchParams = req.body;
    const files = await service.search(searchParams);
    res.json(files);
  } catch (err) {
    res.status(500).send(ensureError(err));
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Get the file key using get request and delete the object from S3
    const curFile = await service.get(id);

    if (curFile && 'filename' in curFile) {
      const curFileKey = curFile?.filename ?? 'FILE_NOT_FOUND';
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME ?? 'NO_BUCKET_NAME_IN_ENV',
        Key: curFileKey
      };

      await s3.deleteObject(params).promise();
    }

    // Delete from prisma db
    const fileDb = await service.destroy(id);
    res.json(fileDb);
  } catch (err) {
    console.error(err);
    res.status(500).send(ensureError(err));
  }
};

export const controller = {
  get,
  create,
  search,
  destroy
};
