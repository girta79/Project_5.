describe('Issue comments creating, editing and deleting', () => {
    Cypress.on('uncaught:exception', (err, runnable) => { return false; });

    const IssueTitle = "Ticket for time tracking";

    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            //cy.visit(url + '/board');
            cy.get('[data-testid="icon:plus"]').click();
            cy.get('[data-testid="select:type"]').click();
            cy.get('[data-testid="select-option:Story"]').wait(500).trigger('click');
            cy.get('input[name="title"]').wait(500).type(IssueTitle);
            cy.get('button[type="submit"]').click();
            cy.get('[data-testid="modal:issue-create"').should('not.exist');
            cy.reload();
            cy.contains(IssueTitle).click();
        });
    });
    
    const selector = {
        estimation: 'input[placeholder="Number"]',
        stopwatch: '[data-testid="icon:stopwatch"]',
        closeX: '[data-testid="icon:close"]',
        modalTracking: '[data-testid="modal:tracking"]'
    };
    const reopen = () => {
        cy.get(selector.closeX).click();
        cy.contains(IssueTitle).click();
    };
    //.type("") doesn't work, so '.clear().type(value)' doesn't work with empty string. This has the same effect:
    const setEstimate   = (value) => cy.get(selector.estimation).type(`{selectall}{backspace}` + value);
    const checkEstimate = (value) => cy.get(selector.estimation).should('have.value', value);
    const getTracking = () => cy.get(selector.stopwatch).next();
    const checkTracking = (value) => {
        if (value) {
            getTracking().should('contain', value + 'h estimated');
        } else {
            getTracking().should('not.contain', 'estimated');
        };
    };
    const testEstimate = (value) => {
        setEstimate(value);
        checkTracking(value);
        reopen();
        checkEstimate(value);
        checkTracking(value);
    };

    it('Time estimation functionality', () => {
        getTracking().should('contain',"No time logged");
        //Add estimation
        testEstimate(10);
        //Update estimation
        testEstimate(20);
        //Remove estimation
        testEstimate("");
    });

    const setTracking = (logged, remaining) => {
        cy.contains('Time Tracking').next().click();
        cy.get(selector.modalTracking).within(() => {
            cy.root().should('be.visible');
            cy.contains('Time spent').next().children('input').type(`{selectall}{backspace}` + logged);
            cy.contains('Time remaining').next().children('input').type(`{selectall}{backspace}` + remaining);
            cy.contains('Done').click();
        });
    };

    it('Time logging functionality', () => {
        //Precondition: Test case 1: Add estimate
        testEstimate(10);
        //Log time
        setTracking(2,5);
        getTracking().should('contain', '2h logged');
        getTracking().should('not.contain', 'No time logged');
        getTracking().should('contain', '5h remaining');
        //Remove logged time
        setTracking("","");
        getTracking().should('contain', 'No time logged');
        checkTracking(10);
    });
});