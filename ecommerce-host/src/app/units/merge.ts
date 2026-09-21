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


  // ==========================================
  // TRY KEY FIRST
  // ==========================================

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


  // ==========================================
  // IF KEY NOT FOUND
  // TRY ID
  // ==========================================

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


  // ==========================================
  // API NULL / UNDEFINED
  // USE CONSTANT
  // ==========================================

  if (
    apiData === null ||
    apiData === undefined
  ) {

    return baseData;

  }


  // ==========================================
  // API EMPTY STRING
  // USE CONSTANT
  // ==========================================

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


  // ==========================================
  // ARRAYS
  // ==========================================

  if (
    Array.isArray(
      baseData
    ) &&
    Array.isArray(
      apiData
    )
  ) {


    // API ARRAY EMPTY
    // KEEP CONSTANT ARRAY

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


    // Primitive array
    // API wins

    if (
      isPrimitiveArray
    ) {

      return apiData;

    }


    // Object array

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


        // API item not in constant

        if (
          index === -1
        ) {

          result.push(
            apiItem
          );

          return;

        }


        // Merge existing object

        result[index] =
          mergeData(
            result[index],
            apiItem
          );

      }
    );


    return result;

  }


  // ==========================================
  // OBJECTS
  // ==========================================

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

            // API has new key
            // Add it

            result[key] =
              apiData[key];

          }

        }
      );


    return result;

  }


  // ==========================================
  // NORMAL VALUE
  // API WINS
  // ==========================================

  return apiData;

}