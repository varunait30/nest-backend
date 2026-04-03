export const Queue = jest.fn().mockImplementation(() => ({
  add: jest.fn(),
  process: jest.fn(),
}));

export const Worker = jest.fn().mockImplementation(() => ({
  on: jest.fn(),
}));

export const QueueScheduler = jest.fn();