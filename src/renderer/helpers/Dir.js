import fs from 'fs'
import app from 'electron'

export default {
    getBaseDir() {
        return app.remote.app.getPath('documents') + '/myos-print';
    },
    getPDFDir() {
        return this.getBaseDir() + '/pdf';
    },
    getImagesDir() {
        return this.getBaseDir() + '/images';
    },
    getFichesRollDir() {
        return this.getBaseDir() + '/fiches-roll';
    },
    setup() {
        if (!fs.existsSync( this.getBaseDir() )){
            fs.mkdirSync( this.getBaseDir() );
        }
        if (!fs.existsSync( this.getPDFDir() )){
            fs.mkdirSync( this.getPDFDir() );
        }
        if (!fs.existsSync( this.getImagesDir() )){
            fs.mkdirSync( this.getImagesDir() );
        }
        if (!fs.existsSync( this.getFichesRollDir() )){
            fs.mkdirSync( this.getFichesRollDir() );
        }
    }
}