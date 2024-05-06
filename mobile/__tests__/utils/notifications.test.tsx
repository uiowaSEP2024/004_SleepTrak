import { generatePlanNotifications } from '../../src/utils/notifications';
import { fetchPlan } from '../../src/utils/db';

jest.mock('../../src/utils/db', () => ({
  fetchPlan: jest.fn()
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
    (fetchPlan as jest.Mock).mockResolvedValue({
      reminders: []
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toEqual([]);
  });

  it('returns a nap notification when there are no naps', async () => {
    user.user.events = user.user.events.filter((event) => event.type !== 'nap');
    (fetchPlan as jest.Mock).mockResolvedValue({
      reminders: [{ description: 'Nap', startTime: new Date().toISOString() }]
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toEqual('Nap');
  });

  it('returns a nap notification when there are less naps than recommended', async () => {
    (fetchPlan as jest.Mock).mockResolvedValue({
      reminders: [{ description: 'Nap', startTime: new Date().toISOString() }]
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toEqual('Nap');
  });

  it('returns a bedtime notification when there are as many naps as recommended', async () => {
    (fetchPlan as jest.Mock).mockResolvedValue({
      reminders: [
        { description: 'Bedtime', startTime: new Date().toISOString() }
      ]
    });

    const notifications = await generatePlanNotifications(user);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toEqual('Bedtime');
  });
});
