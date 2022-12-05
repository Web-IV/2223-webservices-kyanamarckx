import { main } from '../src/index';

describe("our first test", () => {
  it("should succeed", () => {
    expect(2 + 2).toBe(4);
  });

  it("should fail", () => {
    throw new Error('failing test');
  });
});
