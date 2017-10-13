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
    getFichesDir() {
        return this.getBaseDir() + '/fiches';
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
        if (!fs.existsSync( this.getFichesDir() )){
            fs.mkdirSync( this.getFichesDir() );
        }
    }
}