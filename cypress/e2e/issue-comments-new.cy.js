/* PROJECT 5, SPRINT 2, ASSIGNMENT 1.

Create new automation test into the same spec file, which will do following steps:
- add comment
- assert, that comment is added and visible
- edit comment
- assert that updated comment is visible
- remove comment
- assert that comment is removed*/

describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('NEW - Should create, edit, and delete a comment successfully', () => {
        const comment = 'KOMMENTAAR';
        const commentEdited = 'MUUDETUD_KOMMENTAAR';

        // Add comment
        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]')
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...')
                .should('exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', comment);

            // Edit comment
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', comment)
                .clear()
                .type(commentEdited);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', commentEdited);

            // Delete comment
            cy.contains('Delete').click();
        });

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click().should('not.exist');

        getIssueDetailsModal()
            .contains(commentEdited)
            .should('not.exist');

    });
});