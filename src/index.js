import SlackMessage from './SlackMessage';
import {bold} from './utils/textFormatters';
import axios from 'axios';

module.exports = function() {
    return {
        noColors: true,

        reportTaskStart(startTime, userAgents, testCount) {
            this.slack = new SlackMessage();
            this.startTime = startTime;
            this.testCount = testCount;
            this.userAgents = userAgents;

            
            const startingMessage = `${'Starting TestCafe Test.'} \n ${'Total tests:'} ${this.testCount} \n - (Failed test will show: )`;
            
            this.slack.sendMessage(`${startingMessage}\n`);   
        },

        reportFixtureStart: function reportFixtureStart(name) {
            return name;
        },

        reportTestDone: function reportTestDone(name, testRunInfo) {
            const message = this.getTestResults(name, testRunInfo);

            return this.slack.sendMessage(message);
        },
        
        getTestResults: function getTestResults(name, testRunInfo) {
            let message = '';
            const hasErr = !!testRunInfo.errs.length;
      
            if (testRunInfo.skipped) {
                message = '';
            } else if (hasErr) {
                message = ''.concat(`${bold(name)}`, ' - ').concat(`${bold('failed')}`);

                const errorMsgs = testRunInfo.errs.map(function(error) {
                    return error.errMsg;
                });

                message = message + '```' + errorMsgs.join('\n\n\n') + '```';
            } else {
                message = '';
            }
      
            return message;
        },

        reportTaskDone(endTime, passed, warnings, result) {
            const messageEnd = this.getTaskResults(endTime, passed, warnings, result);

            axios.post(process.env.TESTCAFE_SLACK_WEBHOOK || 'https://hooks.slack.com/services/xxxxxxxx', messageEnd);
            
            this.slack.sendTestReport(messageEnd);
        },
        
        getTaskResults: function getTaskResults(endTime, passed, warnings, result) {
            this.endTime = endTime;
            const durationMs  = this.endTime - this.startTime;
            const durationStr = this.moment
                .duration(durationMs)
                .format('h[h] mm[m] ss[s]');
            
            const messageEnd = ''.concat(`${bold('Test End. Duration: ')}`, ' - ').concat(`${bold(durationStr)}`, ' - ').concat(`${bold(result.failedCount)}`, '/').concat(`${bold(this.testCount)}`, ' pased');
            
            return messageEnd;
        }
    };
};
