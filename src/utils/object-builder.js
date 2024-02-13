export function ObjectBuilder() {
  this.object = {};

  this.append = function (key, value) {
    if (key && value) {
      this.object[key] = value;
    }
    return this;
  };

  this.build = function () {
    return this.object;
  };
}