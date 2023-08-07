import { expect } from "chai";
import * as functions from "../app/utils/functions.js";

const { calculateClampValues } = functions;

describe("FUNCTIONS", () => {
  it("should return the right values of clamp function based on 4 parameters", () => {
    expect(calculateClampValues(1.25, 3.125, 37.5, 90)).to.be.equal("clamp(1.25rem, -0.089rem + 3.571vw, 3.125rem)");
    expect(calculateClampValues(0.75, 1.5, 25, 62.5)).to.be.equal("clamp(0.75rem, 0.25rem + 2vw, 1.5rem)");
    expect(calculateClampValues(2.51357, 4.75893, 25.4463, 53.451321)).to.be.equal("clamp(2.514rem, 0.473rem + 8.018vw, 4.759rem)");
  });
});
