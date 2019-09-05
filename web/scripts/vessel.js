function Vessel (id, name, owner, parent) {
  this.id = id
  this.name = name
  this.owner = owner
  this.parent = parent

  // Actions

  this.create = (q) => {
    const name = removeParticles(q)
    const id = paradise.next()
    const vessel = new Vessel(id, name, this, this.parent)
    return paradise.add(vessel) ? 'You created something.' : 'You cannot create that thing.'
  }

  this.enter = (q) => {
    const target = this.target(q)
    if (!target) { return 'You do not see that thing.' }
    this.parent = target
    return 'You entered something.'
  }

  this.leave = () => {
    this.parent = this.parent.parent
    return 'You left something.'
  }

  this.become = (q) => {
    const target = this.target(q)
    if (!target) { return 'You do not see that thing.' }
    client.vessel = target
  }

  this.take = (q) => {

  }

  this.drop = (q) => {

  }

  // Etcs

  this.sight = () => {
    const a = paradise.filter((vessel) => {
      return vessel.parent.id === this.parent.id
    })
    return a
  }

  this.target = (q) => {
    const name = removeParticles(q)
    for (const vessel of this.sight()) {
      if (vessel.name !== name) { continue }
      return vessel
    }
  }

  function removeParticles (str) {
    const particles = ['a', 'the', 'an']
    return str.split(' ').filter((item) => {
      return particles.indexOf(item) < 0
    }).join(' ').trim()
  }

  console.log('Created', id, name, owner, parent)
}
