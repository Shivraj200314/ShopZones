function isObject(
  value: any
): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}
function hasValidKey(
  item: any
): boolean {
  return (
    item?.key !== null &&
    item?.key !== undefined &&
    String(
      item.key
    ).trim() !== ''
  );
}
function findMatchingIndex(
  baseArray: any[],
  apiItem: any
): number {
  if (
    hasValidKey(
      apiItem
    )
  ) {
    const keyIndex =
      baseArray.findIndex(
        (
          baseItem: any
        ) =>
          hasValidKey(
            baseItem
          )
          &&
          String(
            baseItem.key
          ).trim() ===
          String(
            apiItem.key
          ).trim()
      );
    if (
      keyIndex !== -1
    ) {
      return keyIndex;
    }
  }
  if (
    apiItem?.id !== null &&
    apiItem?.id !== undefined
  ) {
    return baseArray.findIndex(
      (
        baseItem: any
      ) =>
        baseItem?.id !== null &&
        baseItem?.id !== undefined &&
        String(
          baseItem.id
        ) ===
        String(
          apiItem.id
        )
    );
  }
  return -1;
}
export function mergeData(
  baseData: any,
  apiData: any
): any {
  if (
    apiData === null ||
    apiData === undefined
  ) {
    return baseData;
  }
  if (
    typeof apiData === 'string' &&
    apiData.trim() === ''
  ) {
    return (
      baseData !== undefined &&
      baseData !== null &&
      baseData !== ''
    )
      ? baseData
      : apiData;
  }
  if (
    Array.isArray(
      baseData
    ) &&
    Array.isArray(
      apiData
    )
  ) {
    if (
      apiData.length === 0
    ) {
      return baseData;
    }
    const isPrimitiveArray =
      apiData.some(
        (
          item: any
        ) =>
          typeof item !== 'object' ||
          item === null
      );
    if (
      isPrimitiveArray
    ) {
      return apiData;
    }
    const result = [
      ...baseData
    ];
    apiData.forEach(
      (
        apiItem: any
      ) => {
        const index =
          findMatchingIndex(
            result,
            apiItem
          );

        if (
          index === -1
        ) {
          result.push(
            apiItem
          );
          return;
        }
        result[index] =
          mergeData(
            result[index],
            apiItem
          );
      }
    );
    return result;
  }
  if (
    isObject(
      baseData
    ) &&
    isObject(
      apiData
    )
  ) {
    const result = {
      ...baseData
    };
    Object
      .keys(
        apiData
      )
      .forEach(
        (
          key: string
        ) => {
          if (
            key in baseData
          ) {
            result[key] =
              mergeData(
                baseData[key],
                apiData[key]
              );
          }
          else {
            result[key] =
              apiData[key];
          }
        }
      );
    return result;
  }
  return apiData;
}