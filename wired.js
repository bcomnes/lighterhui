const Component = require('./')
const { rendner } = require('lighterhtml')

module.exports = class MorphComponent extends Component {
  render () {
    render(this.element, this.createElement)
  }
}
