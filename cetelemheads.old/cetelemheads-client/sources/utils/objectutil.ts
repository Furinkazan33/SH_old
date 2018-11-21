module cetelemheads.utils {
  export class ObjectUtils {
    public static clone(object, propertiesNotToClone: Array<string> = []): Object {
      var clone = {};
      ObjectUtils.merge(object, clone, propertiesNotToClone);
      return clone;
    }

    public static merge(fromObject, toObject, transientProperties: Array<string> = []) {
      for (var index in fromObject) {
        if (transientProperties != null && transientProperties.length > 0) {
          if (transientProperties.indexOf(index) != -1) {
            continue;
          }
        }

        if (typeof fromObject[index] == "object") {
          toObject[index] = ObjectUtils.clone(fromObject[index]);
        } else {
          toObject[index] = fromObject[index];
        }
      }
    }
  }
}
