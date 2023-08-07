import { faker } from '@faker-js/faker';
const randomTitle = faker.lorem.word();

const issueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
const estimatedInputField = () => cy.contains('Original Estimate').next().find('input[placeholder="Number"]');
const closeIssue = () => cy.get('[data-testid="icon:close"]').first().click();
const timeTracking = () => cy.get('[data-testid="icon:stopwatch"]').next();
const timeSpentField = () => cy.get('input[placeholder="Number"]').eq(1);
const timeRemainingField = () => cy.get('input[placeholder="Number"]').eq(2);

const inputField = 'input[placeholder="Number"]';
const modalTracking = '[data-testid="modal:tracking"]';

describe('Time tracking and time logging functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');
        });
        createIssue();
        cy.wait(4000);
        cy.contains(randomTitle).click();
    });

    it('TC(1-3): Add, update and remove estimation', () => {
        // Adding estimation 
        issueDetailsModal().within(() => {
            estimatedInputField().should('not.have.value');
            timeTracking().should('contain', 'No time logged');

            cy.get(inputField).click().type('10').should('have.value', '10');
            /*timeTracking().should('contain', '10h remaining');*/

            closeIssue();
            reopenIssue();

            cy.get(inputField).should('have.value', '10');

            // Updating estimation
            cy.get(inputField).clear().type('20').should('have.value', '20');

            closeIssue();
            reopenIssue();

            cy.get(inputField).should('have.value', '20');
            timeTracking().should('contain', '20h remaining');

            // Removing estimation
            cy.get(inputField).clear().should('have.value', '');

            closeIssue();
            reopenIssue();

            cy.get(inputField).should('have.value', '');
            timeTracking().should('contain', 'No time logged');
        });
    });

    it('TC(4-5): Log time, remove logged time', () => {
        //Logging time
        timeTracking().click();
        cy.get(modalTracking).should('be.visible');

        timeSpentField().click().clear().type(2);
        timeRemainingField().click().clear().type(5);

        cy.contains('button', 'Done').click();
        cy.get(modalTracking).should('not.exist');

        timeTracking().should('contain', '2h logged').should('contain', '5h remaining');

        closeIssue();

        //Removing logged time
        reopenIssue();

        timeTracking().click();
        cy.get(modalTracking).should('be.visible');

        timeSpentField().click().clear();
        timeRemainingField().click().clear();

        cy.contains('button', 'Done').click();
        cy.get(modalTracking).should('not.exist');

        timeTracking().should('contain', 'No time logged');
    });
});

function createIssue() {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('input[name="title"]').wait(100).should('be.visible').type(randomTitle);
        cy.get('button[type="submit"]').click();
        cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    });
}

function reopenIssue() {
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
        cy.get('[data-testid="list-issue"]').first().find('p').contains(randomTitle).click();
    });
}