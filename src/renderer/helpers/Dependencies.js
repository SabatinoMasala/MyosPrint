import fs from 'fs'
const exec = require('child_process').exec;
let sudo = require('sudo-prompt');
import app from 'electron'
import log from 'electron-log';

export default {

    execute(command, callback){
        exec(command, function(error, stdout, stderr){ callback(stdout, stderr); });
    },

    check() {
        this.execute('phantomjs --version', function(output, err) {
            console.log(output);
            if(err !== '') {
                let bin = app.remote.app.getAppPath().replace('Contents/Resources/app', 'Contents/Resources/src/bin/phantomjs');
                log.info(bin);
                log.info(err);
                let options = {
                    name: 'MYOS Printer',
                };
                sudo.exec('cp ' + bin + ' /usr/local/bin/phantomjs', options, function(error, stdout, stderr) {
                    log.info(error);
                    log.info(stdout);
                    log.info(stderr);
                });
            }
        })
    }

}