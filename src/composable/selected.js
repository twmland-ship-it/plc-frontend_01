export function useSelected(
  selectedArr,
  options,
  { childProp = "children", childId = "id" } = {}
) {
  let childOptions = null;
  return selectedArr.reduce((a, b, index) => {
    let tar;
    if (!childOptions) {
      tar = options.find((option) => option[childId] === b);
    } else {
      tar = childOptions.find((option) => option[childId] === b);
    }
    a[index] = JSON.stringify(tar);
    if (index !== selectedArr.length - 1) {
      childOptions = tar[childProp] || null;
    }
    return a;
  }, {});
}

export function useSelectedToArr(selected, prop) {
  return Object.keys(selected).map((key, index) => {
    if (!prop) {
      return JSON.parse(selected[index]);
    } else {
      return JSON.parse(selected[key])[prop];
    }
  });
}
