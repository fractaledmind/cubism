import CableReady from 'cable_ready'
import { SubscribingElement } from 'cable_ready'

export class Cubicle extends SubscribingElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = `
<style>
  :host {
    display: block;
  }
</style>
<slot name="template"></slot>
<slot name="content"></slot>
`

    this.trigger = this.getAttribute('trigger')

    this.addEventListener('cubism:update', this.update.bind(this))
  }

  async connectedCallback () {
    if (this.preview) return
    this.consumer = await CableReady.consumer
    if (this.consumer) {
      this.createSubscription(
        this.consumer,
        'Cubism::PresenceChannel',
        this.performOperations
      )
    } else {
      console.error(
        'The `cubicle-element` helper cannot connect without an ActionCable consumer.'
      )
    }
  }

  performOperations (data) {
    if (data.cableReady) CableReady.perform(data.operations)
  }

  createSubscription (consumer, channel, receivedCallback) {
    this.channel = consumer.subscriptions.create(
      {
        channel,
        identifier: this.getAttribute('identifier'),
        user: this.getAttribute('user')
      },
      {
        received: receivedCallback
      }
    )
  }

  update ({ detail }) {
    const template = this.shadowRoot
      .querySelector('slot[name=template]')
      .assignedElements()[0]

    this.querySelectorAll('[slot=content]').forEach(element => {
      element.remove()
    })

    detail.users.forEach(user => {
      const templateClone = template.content.cloneNode(true)

      for (const attribute in user) {
        templateClone
          .querySelectorAll(`[data-cubicle-attribute=${attribute}]`)
          .forEach(element => {
            element.innerHTML = user[attribute]
          })
      }

      templateClone.firstElementChild.slot = 'content'
      this.appendChild(templateClone.firstElementChild)
    })
  }
}
