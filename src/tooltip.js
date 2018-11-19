function createEntry(header, value) {
  const entry = document.createElement('div');
  const nameHeader = document.createElement('span');
  const nameHeaderValue = document.createTextNode(header);
  const nameValueContainer = document.createElement('b');
  const nameValue = document.createTextNode(value);

  nameHeader.appendChild(nameHeaderValue);
  nameValueContainer.appendChild(nameValue);

  entry.appendChild(nameHeader);
  entry.appendChild(nameValueContainer);

  return entry;
}

export function createTooltipHTML({ name, groupNumber, nodeMeasure }) {
  const tooltip = document.createElement('div');
  const nameEntry = createEntry('Name: ', name);
  const groupNumberEntry = createEntry('Group number: ', groupNumber);
  const nodeMeasureEntry = createEntry('Node measure: ', nodeMeasure);

  tooltip.appendChild(nameEntry);
  tooltip.appendChild(groupNumberEntry);
  tooltip.appendChild(nodeMeasureEntry);

  return tooltip.innerHTML;
}
