export function useNewDataFilter(data, text, targetProps = []) {
  return data.filter((item) => {
    for (let i = 0; i < targetProps.length; i++) {
      if (
        item[targetProps[i]]
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase())
      ) {
        return true;
      }
    }
  });
}

export function useDatatableFilter(data, text, { deep = false } = {}) {
  function deepSearchInObject(obj, searchTerm) {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object" && deep) {
        if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "object") {
              const result = deepSearchInObject(item, searchTerm);
              if (result) {
                return true;
              }
            }
          }
        }
        if (!Array.isArray(value)) {
          const result = deepSearchInObject(value, searchTerm);
          if (result) {
            return true;
          }
        }
      } else {
        if (
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
      }
    }

    return false;
  }

  function searchInArrayOfObjects(array, searchTerm) {
    const matchingObjects = [];

    for (const obj of array) {
      if (deepSearchInObject(obj, searchTerm)) {
        matchingObjects.push(obj);
      }
    }

    return matchingObjects;
  }
  const matchingObjects = searchInArrayOfObjects(data, text);
  return matchingObjects;
}

export function useFilterData(schemes, originData = []) {
  function getNestedValue(obj, keyPath) {
    if (!obj || !keyPath) {
      return null;
    }

    const keys = keyPath.split(".");

    let result = obj;
    for (let key of keys) {
      result = result[key];

      if (result === undefined) {
        return null;
      }
    }

    return result;
  }

  let returnData = originData;
  for (let { type, target, source, sourceProp } of schemes) {
    // [{type:string,source:string,sourceProp:string,target:any}]
    if (!target) continue;
    switch (type) {
      case "text":
        returnData = useDatatableFilter(returnData, target);
        break;
      case "list":
        returnData = returnData.filter((el) => {
          return sourceProp
            ? getNestedValue(el, source)
                .flat()
                .map((el) => el[sourceProp])
                .includes(target)
            : el[source].flat().includes(target);
        });
        break;
      case "element":
        returnData = returnData.filter((el) => {
          return sourceProp
            ? el[source][sourceProp] === target
            : el[source] === target;
        });
        break;
      default:
        break;
    }
  }
  return returnData;
}

export function useFetchTree(
  target,
  initData,
  { childProp = "children", childId = "id" } = {}
) {
  return target.reduce((a, b) => {
    const tar = a.find((el) => el[childId] === b);
    return tar[childProp];
  }, initData);
}

export function getNodeList(nodes, target, childProp, childId, chain = []) {
  for (let node of nodes) {
    if (node[childId] === target) {
      chain.push(node[childId]);
      return chain;
    }
    if (node[childProp]) {
      chain.push(node[childId]);
      const path = getNodeList(target, childProp, childId, chain);
      if (path) {
        return path;
      }
    } else {
      chain.pop();
    }
  }

  return null;
}
