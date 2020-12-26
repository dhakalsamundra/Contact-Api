describe('Contact', function(){
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  it('front page displayed with login/register', () => {
    cy.contains('Contact Keeper')
  })
  it('User can register and logged in at first', function () {
    cy.get('#email').type('dhakalsamundra35@gmail.com')
    cy.get('#password').type('CypressTest123')
    cy.get('#login').click()

    cy.contains('Hello CypressTest')
  })

  it('Can logout too', function () {
    cy.get('#email').type('dhakalsamundra35@gmail.com')
    cy.get('#password').type('CypressTest123')
    cy.get('#login').click()
    cy.get('#logout').click()
  })

  it('only valid user can log in', function () {
    cy.get('#email').type('acd@gmail.com')
    cy.get('#password').type('asdc')
    cy.get('#login').click()

    cy.contains('Invalid Credentials')
  })

  describe('When logged In', function () {
    beforeEach(function() {
      cy.get('#email').type('dhakalsamundra35@gmail.com')
      cy.get('#password').type('CypressTest123')
      cy.get('#login').click()    })

    it('can save the contact', function () {
      cy.get('#name').type('sam')
      cy.get('#email').type('xxx@xxx.com')
      cy.get('#number').type(1234567890)
      cy.get('#professional').click()
      cy.get('#add').click()

      cy.contains('sam')
    })

    it('can edit the contact', function () {
      cy.contains('Edit').click()
      cy.get('#personal').click()
      cy.get('#add').click()

      cy.contains('Personal')
    })

    it('can search the contact', function () {
      cy.get('#search').type('xxx@xxx.com')

      cy.contains('xxx@xxx.com')
    })

    it('can delete the contact', function () {
      cy.contains('Delete').click()

      cy.contains('Contact deleted')
    })
  })

  it('can also request password if forgetten', function () {
    cy.get('#forget').click()
    cy.get('#email').type('dhakalsamundra35@gmail.com')
    cy.get('#submit').click()
    cy.contains('Reset link has been sent to the provided email address.')
  })
})