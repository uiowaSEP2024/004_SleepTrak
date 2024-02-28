import { testRoute } from './common.js';

const mockBabys = [
  {
    babyId: '1',
    parentId: '1',
    name: 'Mingi',
    dob: '2022-01-01',
    weight: 12,
    medicine: 'vitamin c'
  },
  {
    babyId: '2',
    parentId: '2',
    name: 'Matt',
    dob: '2023-06-06',
    weight: 10,
    medicine: 'tylenol'
  }
];
const baby = {
  babyId: '3',
  parentId: '3',
  name: 'Adnane',
  dob: '2021-03-03',
  weight: 8,
  medicine: 'pencillin'
};

// /babys/all
testRoute({
  reqData: {},
  mockData: mockBabys,
  expectData: {
    status: 200,
    body: mockBabys
  },
  model: 'baby',
  route: 'all'
});

// /babys/:id
testRoute({
  reqData: {},
  mockData: mockBabys.filter((baby) => baby.babyId === '1'),
  expectData: {
    status: 200,
    body: mockBabys.filter((baby) => baby.babyId === '1'),
    calledWith: {
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1'
});

// /babys/search
testRoute({
  reqData: {
    role: 'client'
  },
  mockData: mockBabys.filter((baby) => baby.medicine === 'tylenol'),
  expectData: {
    status: 200,
    body: mockBabys.filter((baby) => baby.medicine === 'tylenol'),
    calledWith: {
      where: {
        role: 'client'
      }
    }
  },
  model: 'baby',
  route: 'search'
});

// /babys/create
const { babyId: _u, parentId: _p, ...babyProps } = baby;
testRoute({
  reqData: {
    ...baby
  },
  mockData: baby,
  expectData: {
    status: 200,
    body: baby,
    calledWith: {
      data: {
        ...babyProps,
        dob: new Date(baby.dob),
        parent: { connect: { userId: baby.parentId } }
      }
    }
  },
  model: 'baby',
  route: 'create'
});

// /babys/update
testRoute({
  reqData: {
    ...baby
  },
  mockData: baby,
  expectData: {
    status: 200,
    body: baby,
    calledWith: {
      data: {
        ...baby
      },
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1',
  route: 'update'
});

// /babys/delete
testRoute({
  reqData: {},
  mockData: baby,
  expectData: {
    status: 200,
    body: baby,
    calledWith: {
      where: {
        babyId: ':id'
      }
    }
  },
  model: 'baby',
  id: '1',
  route: 'delete'
});
