module.exports = {
    reporterMethods: {
        function() {
            return {
                async reportTaskStart(startTime, userAgents, testCount) {
                    this.startTime = startTime;
                    this.testCount = testCount;
        
                    this.write(`Running tests in: ${userAgents}`)
                        .newline()
                        .newline();
                },
        
                async reportFixtureStart(name) {
                    this.currentFixtureName = name;
                },
        
                async reportTestDone(name, testRunInfo) {
                    const errors      = testRunInfo.errs;
                    const warnings    = testRunInfo.warnings;
                    const browsers    = testRunInfo.browsers;
                    const reportData  = testRunInfo.reportData;
                    const hasErrors   = !!errors.length;
                    const hasWarnings = !!warnings.length;
                    const result      = hasErrors ? 'failed' : 'passed';
        
                    name = `${this.currentFixtureName} - ${name}`;
        
                    const title = `${result} ${name}`;
        
                    this.write(title);
        
                    if (hasErrors) {
                        this.newline()
                            .write('Errors:');
        
                        errors.forEach(error => {
                            this.newline()
                                .write(this.formatError(error));
                        });
                    }
        
                    if (hasWarnings) {
                        this.newline()
                            .write('Warnings:');
        
                        warnings.forEach(warning => {
                            this.newline()
                                .write(warning);
                        });
                    }
                    browsers.forEach(browser => {
                        const {testRunId, prettyUserAgent} = browser;
                        const browserData = reportData[testRunId];
         
                        this.write(prettyUserAgent)
                            .newline()
                            .write(browserData);
                    });
        
                },
        
                async reportTaskDone(endTime, passed, warnings, result) {
                    const durationMs  = endTime - this.startTime;
                    
                    const durationStr = this.moment
                        .duration(durationMs)
                        .format('h[h] mm[m] ss[s]');

                    let footer = result.failedCount ?
                        `${result.failedCount}/${this.testCount} failed` :
                        `${result.passedCount} passed`;
        
                    footer += ` (Duration: ${durationStr})`;
                    footer += ` (Skipped: ${result.skippedCount})`;
                    footer += ` (Warnings: ${warnings.length})`;
        
                    this.write(footer)
                        .newline();
                }
            };
        }
    },
    'loggingLevel': 'SUMMARY'
};
