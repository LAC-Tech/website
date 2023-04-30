/**
 * @template {Object} T
 * @template U
 * @param {( key: keyof T, value: T[keyof T]) => U} f 
 * @param {T} obj 
 * @returns {Record<keyof T, U>}
 */
export const mapObject = (f, obj) => {
  const result = /** @type {Record<keyof T, U>} */ ({})

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = f(key, obj[key])
    }
  }

  return result;
}

/**
 * Performs a deep comparison between two values to determine if they are equivalent.
 * 
 * @param {*} value1 - The first value to compare.
 * @param {*} value2 - The second value to compare.
 */
export const deepEquals = (value1, value2) => {
  if (value1 === value2) return true
  if (value1 == null || value2 == null) return false

  const type1 = typeof value1
  const type2 = typeof value2
  if (typeof value1 !== typeof value2) return false

  if (type1 === 'object') {
    if (value1 instanceof Map && value2 instanceof Map) {
      const entries1 = [...value1.entries()]
      const entries2 = [...value2.entries()]

      if (entries1.length !== entries2.length) return false

      // Compare each entry recursively
      for (const [key1, val1] of entries1) {
        const val2 = value2.get(key1)
        if (!deepEquals(val1, val2)) {
          return false
        }
      }

      return true
    }

    if (Array.isArray(value1)) {
      if (value1.length !== value2.length) return false

      // Compare each element recursively
      for (let i = 0; i < value1.length; i++) {
        if (!deepEquals(value1[i], value2[i])) {
          return false
        }
      }

      return true
    }

    const keys1 = Object.keys(value1)
    const keys2 = Object.keys(value2)

    if (keys1.length !== keys2.length) return false

    // Compare each property recursively
    for (const key of keys1) {
      if (!deepEquals(value1[key], value2[key])) {
        return false
      }
    }

    return true
  }

  return value1 == value2
}

/**
 * @template T, U
 * @param {(x: T, y: T) => U} f
 * @param {Map<string, T>} map1
 * @param {Map<string, T>} map2
 * @return {Map<string, U>}
 */
export const mergeWith = (f, map1, map2) => {
  const result = new Map()

  // Copy entries from the first map
  for (const [key, value] of map1.entries()) {
    result.set(key, value)
  }

  // Merge entries from the second map
  for (const [key, value] of map2.entries()) {
    if (result.has(key)) {
      result.set(key, f(result.get(key), value))
    }
    // Otherwise, add the entry from the second map to the result map
    else {
      result.set(key, value)
    }
  }

  // Return the merged map
  return result
}

/**
 * @template T
 * @param {Set<T>} set1
 * @param {Set<T>} set2
 */
export const isSubset = (set1, set2) => {
  for (let item of set1) {
    if (!set2.has(item)) return false
  }

  return true
}

/**
 * @template T
 * @param {Set<T>} set1
 * @param {Set<T>} set2
 */
export const setUnion = (set1, set2) => {
  const result = new Set(set1)
  for (const elem of set2) {
    result.add(elem)
  }
  return result
}

/**
 * @template T
 * @param {(x: T, y: T) => boolean} equals
 * @return {(xs: T[], ys: T[]) => T[]}
 */
export const arrayUnion = equals => (xs, ys) => {
  const result = [];

  for (const x of xs) result.push(x)

  for (const y of ys) {
    let found = false;
    for (const existingElem of result) {
      if (existingElem === y) {
        found = true;
        break;
      }
    }
    
    if (!found) result.push(y)
  }

  return result;
}

// Generate a UUID as a byte array
export const uuid = () => {
  const data = new Uint8Array(16)
  crypto.getRandomValues(data)
  return data
}

/**
 * @template T
 * @param {(x: T, y: T) => boolean} equals
 * @return {(xs: T[], ys: T[]) => T[]}
 */
export const relativeComplement = equals => (xs, ys) =>
  xs.filter((x) => !ys.some(y => equals(x, y)))
