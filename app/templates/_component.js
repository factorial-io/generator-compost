export default class <%= _.capitalize(_.camelCase(name)) %> {
  /**
   * Sets up instance variables and calls mounted hook.
   *
   * @param {HTMLElement} element
   * @param {Object} options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.mounted();
  }

  /**
   * Sets up event listeners
   */
  mounted() {
    console.log(this.element); // eslint-disable-line
  }
}
