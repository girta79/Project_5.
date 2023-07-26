describe('Tests for delete issue and cancel deleting.', () => {
    
    const issueName = 'This is an issue of type: Task.';
    
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
          cy.visit(url + '/board');
          cy.contains(issueName).click();
        });
        //Assert that issue detail page is opened. 
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');  
      });

      it('Task 1: Delete issue', () => {
        //Find and click Delete button.
        cy.get('[data-testid="icon:trash"]').click();
        //Conirm delete
        cy.get('[data-testid="modal:confirm"]').contains('Delete issue').click();
        //Assert that delete confirmation window is closed.
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        //Assert that deleted issue is not in the list.
        cy.reload();
        cy.get('[data-testid="board-list:backlog"]').should('not.contain', issueName);
      });

      it('Task 2: Canceling deleting progress', () => {
        //Find and click Delete button.
        cy.get('[data-testid="icon:trash"]').click();
        //Cancel delete
        cy.get('[data-testid="modal:confirm"]').contains('Cancel').click();
        //Assert that delete confirmation window is closed.
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        //Close issue detail view. There is two X buttons, this select first button.
        cy.get('[data-testid="icon:close"]').first().click();
        //Assert that issue is still in the list.
        cy.get('[data-testid="board-list:backlog"]').should('contain', issueName);
        
      });
    
});