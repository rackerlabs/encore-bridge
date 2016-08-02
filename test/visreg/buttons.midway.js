describe('buttons', function () {
    before(function () {
        browser.get('#/elements/Buttons');
    });

    describe('primary', function () {
        it('large', function () {
            screenshot.snap(this, $('#primary-large'));
        });
    });

    describe('secondary', function () {
        it('large', function () {
            screenshot.snap(this, $('#secondary-large'));
        });
    });
});
