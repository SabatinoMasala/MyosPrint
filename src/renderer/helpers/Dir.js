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
    getFichesBlackmarkDir() {
        return this.getBaseDir() + '/fiches-blackmark';
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
        if (!fs.existsSync( this.getFichesBlackmarkDir() )){
            fs.mkdirSync( this.getFichesBlackmarkDir() );
        }
    }
}