import { generatePlanNotifications } from '../../src/utils/notifications';
import { fetchRecommendedPlan } from '../../src/utils/db';

jest.mock('../../src/utils/db', () => ({
  fetchRecommendedPlan: jest.fn()
}));

describe('notifications', () => {
  let user: { user: any };

  beforeEach(() => {
    user = {
      user: {
        events: [
          { type: 'nap', endTime: new Date().toISOString() },
          {
            type: 'night_sleep',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString()
          }
        ]
      }
    };
  });

  it('returns an empty array when there are no events', async () => {
    user.user.events = [];
    (fetchRecommendedPlan as jest.Mock).mockResolvedValue({
      numOfNaps: 1,
      wakeWindow: 1
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toEqual([]);
  });

  it('returns a nap notification when there are no naps', async () => {
    user.user.events = user.user.events.filter((event) => event.type !== 'nap');
    (fetchRecommendedPlan as jest.Mock).mockResolvedValue({
      numOfNaps: 1,
      wakeWindow: 1
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toEqual('Nap');
  });

  it('returns a nap notification when there are less naps than recommended', async () => {
    (fetchRecommendedPlan as jest.Mock).mockResolvedValue({
      numOfNaps: 2,
      wakeWindow: 1
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toEqual('Nap');
  });

  it('returns a bedtime notification when there are as many naps as recommended', async () => {
    (fetchRecommendedPlan as jest.Mock).mockResolvedValue({
      numOfNaps: 1,
      wakeWindow: 1
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toEqual('Bedtime');
  });
});
