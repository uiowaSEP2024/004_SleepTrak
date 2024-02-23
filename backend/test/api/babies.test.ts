const request = require('supertest');
const app = require('../../src/app');
const { prismaMock } = require('../mock_client');

const mockBabies = [
  {
    babyId: 1,
    name: 'Sid',
    weight: 12.5,
    medicine: 'tylenol'
  },
  {
    babyId: 2,
    name: 'Glen',
    weight: 15.0,
    medicine: 'ibuprofen'
  },
  {
    babyId: 3,
    name: 'Bobby',
    weight: 13.8,
    medicine: 'vitamins'
  }
];
const baby = {
  babyId: 4,
  name: 'Jerry',
  weight: 8.5,
  medicine: 'water'
};

describe('Test /babies/all route', () => {
  test('GET /babies returns all babies', async () => {
    prismaMock.baby.findMany.mockReturnValue(mockBabies);
    const response = await request(app).get('/babies/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockBabies);
    expect(prismaMock.baby.findMany).toHaveBeenCalledWith();
  });
});

describe('test /babies/:id route', () => {
  test('GET /babies/:id calls findUnique and returns baby', async () => {
    const tid = 3;
    prismaMock.baby.findUnique.mockReturnValue(
      mockBabies.filter((babies) => babies.id === tid)
    );
    const response = await request(app).get('/babies/{tid}');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockBabies.filter((babies) => babies.id === tid)
    );
    response.body.forEach((baby) => {
      expect(baby.id).toEqual(tid);
    });
    expect(prismaMock.baby.findUnique).toHaveBeenCalledWith({
      where: { babyId: '{tid}' }
    });
  });
});

describe('test /babies/search route', () => {
  test('GET /babies/search calls findMany and returns babies', async () => {
    const name = 'Glen';
    prismaMock.baby.findMany.mockReturnValue(
      mockBabies.filter((baby) => baby.name === name)
    );
    const response = await request(app).get('/babies/search');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      mockBabies.filter((baby) => baby.name === name)
    );
    response.body.forEach((baby) => {
      expect(baby.name).toEqual(name);
    });
    expect(prismaMock.baby.findMany).toHaveBeenCalledWith({ where: {} });
  });
});

describe('test /babies/create route', () => {
  test('POST /babies/create calls create and returns baby', async () => {
    prismaMock.baby.create.mockReturnValue(baby);
    const response = await request(app).post('/babies/create');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(baby);
  });
});

describe('test /babies/:id/update route', () => {
  test('PUT /babies/:id/update calls update and returns baby', async () => {
    prismaMock.baby.update.mockReturnValue(baby);
    const response = await request(app)
      .put('/babies/4/update')
      .send({ name: 'Mary' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(baby);
    expect(prismaMock.baby.update).toHaveBeenCalledWith({
      data: {
        name: 'Mary'
      },
      where: { babyId: '4' }
    });
  });
});

describe('test /babies/:id/delete route', () => {
  test('PUT /babies/:id/delete calls delete and returns delete info', async () => {
    prismaMock.baby.delete.mockReturnValue(baby);
    const response = await request(app).delete('/babies/4/delete');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(baby);
    expect(prismaMock.baby.delete).toHaveBeenCalledWith({
      where: { babyId: '4' }
    });
  });
});
