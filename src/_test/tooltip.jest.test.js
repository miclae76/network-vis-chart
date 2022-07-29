import { createTooltipHTML } from "../tooltip";

describe("createTooltipHTML", () => {
  it("Testing createTooltipHtml function - Name- GroupNumber- nodeMeasure", () => {
    expect(
      createTooltipHTML({ name: "Venice", groupNumber: 1, nodeMeasure: 2 })
    ).toContainHTML(
      "<div><div><span>Name: </span><b>Venice</b></div><div><span>Group number: </span><b>1</b></div><div><span>Node measure: </span><b>2</b></div></div>"
    );
  });
});
