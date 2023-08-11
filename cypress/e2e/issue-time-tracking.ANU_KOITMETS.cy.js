describe('Issue time tracking', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
        });
    });

    it('Should create an issue', () => {

        cy.get('[data-testid="icon:plus"]').click()
        cy.get('[data-testid="modal:issue-create"]');
        cy.get('.ql-editor').type('description_here');
        cy.get('input[name="title"]').type('title_here');
        cy.get('button[type="submit"]').click();

        //User opens issue detail view
        cy.contains('title_here').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="modal:issue-details"]').within(() => {

            //Check that time tracker has no spent time added (“No Time Logged” label is visible)
            cy.contains('No time logged').should('be.visible');

            //User adds value 10 to “Original estimate (hours)” field
            cy.get('input[placeholder="Number"]').click().type('10');

            //User closes issue detail page
            cy.get('[data-testid="icon:close"]').first().click();
        });
        cy.wait(10000)

        //User reopens the same issue to check that original estimation is saved
        cy.contains('title_here').click();

        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.contains('10h estimated').should('be.visible');

            //User changes value in the field “Original estimate (hours)” from previous value to 20
            cy.get('input[placeholder="Number"]').click().clear().type('20');

            //User closes issue detail page
            cy.get('[data-testid="icon:close"]').first().click();
        });
        cy.wait(10000)

        //User reopens the same issue to check that original estimation is saved
        cy.contains('title_here').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.contains('20h estimated').should('be.visible');

            //User removes value from the field “Original estimate (hours)”
            cy.get('input[placeholder="Number"]').click().clear();

            //User closes issue detail page
            cy.get('[data-testid="icon:close"]').first().click();
        });
        cy.wait(10000)

        //User reopens the same issue to check that original estimation is saved
        cy.contains('title_here').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="modal:issue-details"]').within(() => {

            cy.get('input[placeholder="Number"]')
            cy.contains('20h estimated').should('not.exist');
        });

        //User clicks on time tracking section
        cy.get('[data-testid="icon:stopwatch"]').click();

        //Check that time tracking pop-up dialogue is opened
        cy.get('[data-testid="modal:tracking"]').should('be.visible');

        //User enters value 2 to the field “Time spent”
        cy.get('input[placeholder="Number"]').eq('1').clear().type('2');

        //User enters value 5 to the field “Time remaining”
        cy.get('input[placeholder="Number"]').eq('2').clear().type('5');

        //User click button “Done”
        cy.get('button').last().click();

        //Expected result
        cy.contains('2h logged').should('be.visible')
        cy.contains('5h remaining').should('be.visible')
        cy.contains('No time logged').should('not.exist');

        //User click on time tracking section
        cy.get('[data-testid="icon:stopwatch"]').click();

        //Check that time tracking pop-up dialogue is opened
        cy.get('[data-testid="modal:tracking"]').should('be.visible');

        //User removes value from the field “Time spent”
        cy.get('input[placeholder="Number"]').eq('1').clear();

        //User removes value from the field “Time remaining”
        cy.get('input[placeholder="Number"]').eq('2').clear();

        //User click button “Done”
        cy.get('button').last().click();

        //Expected result
        cy.contains('2h logged').should('not.exist')
        cy.contains('5h remaining').should('not.exist')
        cy.contains('No time logged').should('be.visible');
        cy.contains('Original Estimate (hours)').should('be.visible')
    })
});